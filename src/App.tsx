import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/common/ToastContainer';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { MobileNav } from './components/layout/MobileNav';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { UserProfileModal } from './components/profile/UserProfileModal';

import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { PomodoroPage } from './pages/PomodoroPage';
import { CalendarViewPage } from './pages/CalendarViewPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';

import { Task } from './types/task';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const MainAppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout, updateProfile } = useAuth();
  const {
    addTask,
    editTask,
    deleteTask,
    toggleTask,
    toggleSubtask,
    stats,
  } = useTasks();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const openCreateModal = () => {
    setEditingTask(null);
    setIsCreateModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner message="Starting StudyFlow workspace..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <ToastContainer />
      </>
    );
  }

  const handleFormSubmit = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      return await editTask(editingTask.id, taskData);
    }
    return await addTask(taskData);
  };

  const renderActivePage = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigateToTasks={() => setCurrentTab('tasks')}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onOpenCreateTask={openCreateModal}
            onViewTaskDetails={(task) => setViewingTask(task)}
          />
        );
      case 'tasks':
        return (
          <TasksPage
            onOpenCreateModal={openCreateModal}
            onOpenEditModal={setEditingTask}
            onViewTaskDetails={(task) => setViewingTask(task)}
          />
        );
      case 'timer':
        return <PomodoroPage />;
      case 'calendar':
        return (
          <CalendarViewPage
            onViewTask={(task) => setViewingTask(task)}
            onOpenCreateModal={openCreateModal}
          />
        );
      case 'profile':
        return <ProfilePage />;
      default:
        return (
          <DashboardPage
            onNavigateToTasks={() => setCurrentTab('tasks')}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onOpenCreateTask={openCreateModal}
            onViewTaskDetails={(task) => setViewingTask(task)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex text-slate-800 selection:bg-violet-100 selection:text-violet-800">
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreateModal={openCreateModal}
        user={user}
        pendingCount={stats.pendingCount + stats.inProgressCount}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar
          user={user}
          onOpenCreateModal={openCreateModal}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onLogout={logout}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreateModal={openCreateModal}
        user={user}
        pendingCount={stats.pendingCount + stats.inProgressCount}
      />

      <TaskFormModal
        isOpen={isCreateModalOpen || Boolean(editingTask)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
        mode={editingTask ? 'edit' : 'create'}
      />

      <TaskDetailModal
        task={viewingTask}
        isOpen={Boolean(viewingTask)}
        onClose={() => setViewingTask(null)}
        onEdit={(task) => {
          setViewingTask(null);
          setEditingTask(task);
        }}
        onDelete={(id) => {
          deleteTask(id);
          setViewingTask(null);
        }}
        onToggleStatus={(id) => toggleTask(id)}
        onToggleSubtask={(taskId, subtaskId) => toggleSubtask(taskId, subtaskId)}
      />

      <UserProfileModal
        user={user}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdate={updateProfile}
      />

      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <TaskProvider>
          <MainAppContent />
        </TaskProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

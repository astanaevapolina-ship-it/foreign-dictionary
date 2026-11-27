import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Вход в систему — LexiNote Словарь иностранных слов',
  description: 'Авторизация для управления карточками слов, добавления и редактирования записей.',
};

export default function LoginPage() {
  return <LoginForm />;
}

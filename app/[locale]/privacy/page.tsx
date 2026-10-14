import LegalPage, { type LegalDoc } from '../../../components/LegalPage';

const EMAIL = 'usmleforimgs.drvinograd@gmail.com';

const en: LegalDoc = {
  title: 'Privacy Policy',
  updated: 'Last updated: October 14, 2026',
  intro:
    'This policy explains what information Dr. Asiia Vinograd ("we", "us") collects through drasiiavinograd.com and our educational channels, how we use it, and the choices you have.',
  sections: [
    {
      h: 'Information we collect',
      p: [
        'Contact form: your name, WhatsApp number, and optionally your email, Telegram username and message — only what you choose to send us.',
        'Student account: your email address and the password you set (stored in hashed form by our authentication provider).',
        'Usage data: anonymous statistics about how pages are used, collected with Google Analytics (pages viewed, approximate country, device type).',
      ],
    },
    {
      h: 'Social media integrations (YouTube, Instagram, Facebook, Threads, TikTok, VK, Telegram)',
      p: [
        'We use the official APIs of these platforms only to publish our own educational videos and posts to our own accounts and to read basic statistics of those posts.',
        'When an account owner connects a platform (for example, logs in with TikTok), we receive an access token and basic profile information (display name, avatar, account ID). We use them only to upload or publish content the account owner has approved and to show the result of the upload.',
        'We do not collect data about other users of these platforms, we do not sell or share any platform data, and we do not use it for advertising.',
        'Access tokens are stored encrypted on our server. You can revoke access at any time in the settings of the respective platform (for TikTok: Settings → Security → Manage app permissions), or ask us to delete the data by email.',
      ],
    },
    {
      h: 'How we use information',
      p: [
        'To reply to your requests, provide access to study materials and subscriptions, publish our own content, and improve the website. We do not sell personal information.',
      ],
    },
    {
      h: 'Service providers',
      p: [
        'We use trusted providers to run the service: Vercel (hosting), Supabase (database and authentication), Google Analytics (statistics), Telegram (notifications), Patreon (payments). They process data only on our behalf.',
      ],
    },
    {
      h: 'Retention and deletion',
      p: [
        'Contact requests are kept as long as needed to answer them. Account data is kept while your account is active. Platform tokens are deleted as soon as the connection is revoked. To delete your data, email us at ' +
          EMAIL +
          ' and we will do it within 30 days.',
      ],
    },
    {
      h: 'Children',
      p: ['Our services are intended for medical students and doctors and are not directed to children under 16.'],
    },
    {
      h: 'Contact',
      p: ['Questions about this policy: ' + EMAIL + '.'],
    },
  ],
};

const ru: LegalDoc = {
  title: 'Политика конфиденциальности',
  updated: 'Обновлено: 14 октября 2026',
  intro:
    'Здесь описано, какие данные доктор Асия Виноград («мы») получает через сайт drasiiavinograd.com и наши образовательные каналы, как мы их используем и какие у вас есть права.',
  sections: [
    {
      h: 'Какие данные мы получаем',
      p: [
        'Форма обратной связи: имя, номер WhatsApp и, по желанию, email, Telegram и текст сообщения — только то, что вы сами отправили.',
        'Личный кабинет: email и пароль (хранится в зашифрованном виде у провайдера авторизации).',
        'Статистика: обезличенные данные о посещении страниц через Google Analytics (просмотренные страницы, примерная страна, тип устройства).',
      ],
    },
    {
      h: 'Интеграции с соцсетями (YouTube, Instagram, Facebook, Threads, TikTok, ВКонтакте, Telegram)',
      p: [
        'Мы используем официальные API этих платформ только для публикации наших собственных образовательных видео и постов в наших аккаунтах и для просмотра статистики этих публикаций.',
        'Когда владелец аккаунта подключает платформу (например, входит через TikTok), мы получаем токен доступа и базовые данные профиля (имя, аватар, ID аккаунта). Они используются только для загрузки и публикации контента, одобренного владельцем аккаунта.',
        'Мы не собираем данные других пользователей платформ, не продаём и не передаём данные платформ третьим лицам и не используем их для рекламы.',
        'Токены доступа хранятся в зашифрованном виде на нашем сервере. Доступ можно отозвать в настройках платформы (в TikTok: Настройки → Безопасность → Управление разрешениями приложений) или попросить нас удалить данные по email.',
      ],
    },
    {
      h: 'Как мы используем данные',
      p: [
        'Чтобы ответить на ваши вопросы, дать доступ к материалам и подписке, публиковать наш контент и улучшать сайт. Мы не продаём персональные данные.',
      ],
    },
    {
      h: 'Сервисы, которые мы используем',
      p: [
        'Vercel (хостинг), Supabase (база данных и авторизация), Google Analytics (статистика), Telegram (уведомления), Patreon (оплата). Они обрабатывают данные только по нашему поручению.',
      ],
    },
    {
      h: 'Хранение и удаление',
      p: [
        'Заявки храним, пока нужно на них ответить; данные аккаунта — пока аккаунт активен; токены платформ удаляются сразу после отзыва доступа. Чтобы удалить свои данные, напишите на ' +
          EMAIL +
          ' — сделаем в течение 30 дней.',
      ],
    },
    {
      h: 'Дети',
      p: ['Наши материалы предназначены для студентов-медиков и врачей и не рассчитаны на детей младше 16 лет.'],
    },
    {
      h: 'Контакты',
      p: ['Вопросы по этой политике: ' + EMAIL + '.'],
    },
  ],
};

export default function PrivacyPage() {
  return <LegalPage en={en} ru={ru} />;
}

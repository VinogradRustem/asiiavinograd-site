import LegalPage, { type LegalDoc } from '../../../components/LegalPage';

const EMAIL = 'usmleforimgs.drvinograd@gmail.com';

const en: LegalDoc = {
  title: 'Privacy Policy',
  updated: 'Last updated: October 20, 2026',
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
        'We do not sell or share any platform data and we do not use it for advertising.',
      ],
    },
    {
      h: 'Comments and direct messages on our own accounts',
      p: [
        'To answer questions from students, we read comments left under our own posts and videos and messages sent to our own accounts on Instagram, Facebook, Threads, YouTube, VK and Telegram. For each comment or message we receive the public username or account ID of the author, the text, the time and the post it belongs to.',
        'This data is used only to reply to you: Dr. Vinograd sees the comment in a private moderation tool, an AI assistant (Anthropic Claude) may suggest a draft answer, and Dr. Vinograd approves, edits or rejects it before anything is published. We can also hide spam or offensive comments on our own posts.',
        'If you write a keyword in a comment (for example to receive a free study guide), we may send you one private reply in Direct with the requested material. We do not send unsolicited messages and we do not add you to any list without your action.',
        'Comment and message data is stored in our database (Supabase) for up to 12 months and then deleted. It is never sold, shared with third parties for their own use, or used for advertising.',
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
        'We use trusted providers to run the service: Vercel (hosting), Supabase (database and authentication), Google Analytics (statistics), Telegram (notifications), Patreon (payments), Anthropic (AI drafts of replies). They process data only on our behalf.',
      ],
    },
    {
      h: 'Retention and deletion',
      p: [
        'Contact requests are kept as long as needed to answer them. Account data is kept while your account is active. Platform tokens are deleted as soon as the connection is revoked. To delete your data, email us at ' +
          EMAIL +
          ' and we will do it within 30 days. Step-by-step instructions: drasiiavinograd.com/data-deletion.',
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
  updated: 'Обновлено: 20 октября 2026',
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
        'Мы не продаём и не передаём данные платформ третьим лицам и не используем их для рекламы.',
      ],
    },
    {
      h: 'Комментарии и личные сообщения в наших аккаунтах',
      p: [
        'Чтобы отвечать на вопросы студентов, мы читаем комментарии под нашими собственными публикациями и сообщения, отправленные в наши аккаунты в Instagram, Facebook, Threads, YouTube, ВКонтакте и Telegram. По каждому комментарию или сообщению мы получаем публичное имя или ID автора, текст, время и публикацию, к которой он относится.',
        'Эти данные используются только для ответа вам: доктор Виноград видит комментарий в закрытом инструменте модерации, ИИ-помощник (Anthropic Claude) может предложить черновик ответа, а доктор Виноград одобряет, правит или отклоняет его до публикации. Мы также можем скрывать спам и оскорбительные комментарии под своими публикациями.',
        'Если вы пишете кодовое слово в комментарии (например, чтобы получить бесплатный материал), мы можем отправить вам один личный ответ в Direct с этим материалом. Мы не делаем рассылок без вашего действия и никуда вас не добавляем без вашего согласия.',
        'Данные комментариев и сообщений хранятся в нашей базе данных (Supabase) не дольше 12 месяцев и затем удаляются. Мы их не продаём, не передаём третьим лицам и не используем для рекламы.',
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
        'Vercel (хостинг), Supabase (база данных и авторизация), Google Analytics (статистика), Telegram (уведомления), Patreon (оплата), Anthropic (черновики ответов с помощью ИИ). Они обрабатывают данные только по нашему поручению.',
      ],
    },
    {
      h: 'Хранение и удаление',
      p: [
        'Заявки храним, пока нужно на них ответить; данные аккаунта — пока аккаунт активен; токены платформ удаляются сразу после отзыва доступа. Чтобы удалить свои данные, напишите на ' +
          EMAIL +
          ' — сделаем в течение 30 дней. Подробная инструкция: drasiiavinograd.com/data-deletion.',
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

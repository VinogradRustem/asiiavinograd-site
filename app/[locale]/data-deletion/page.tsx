import LegalPage, { type LegalDoc } from '../../../components/LegalPage';

const EMAIL = 'usmleforimgs.drvinograd@gmail.com';

// Data deletion instructions (required by Meta for the Instagram / Facebook / Threads app "Asiia Autopost").
const en: LegalDoc = {
  title: 'Data Deletion Instructions',
  updated: 'Last updated: October 20, 2026',
  intro:
    'You can ask us at any time to delete the data we received about you through Instagram, Facebook, Threads or our website: your comments, messages, username and account ID.',
  sections: [
    {
      h: 'Option 1. Email request',
      p: [
        'Send an email to ' + EMAIL + ' with the subject "Data deletion" and your username on the platform (for example your Instagram handle).',
        'We delete all comments, messages and identifiers linked to that username from our database within 30 days and confirm by email.',
      ],
    },
    {
      h: 'Option 2. Remove the app in your Facebook or Instagram settings',
      p: [
        'Facebook: Settings & privacy → Settings → Apps and websites → find "Asiia Autopost" → Remove.',
        'Instagram: Settings → Website permissions → Apps and websites → find "Asiia Autopost" → Remove.',
        'After that the app can no longer access your data. To also erase what is already stored, use option 1.',
      ],
    },
    {
      h: 'What is deleted',
      p: [
        'Comment and message texts, your username and account ID, the drafts of our replies and any delivery records of materials sent to you. Public replies that Dr. Vinograd already posted under her own posts can also be removed on request.',
      ],
    },
    {
      h: 'Contact',
      p: ['Questions: ' + EMAIL + '. Full policy: drasiiavinograd.com/privacy.'],
    },
  ],
};

const ru: LegalDoc = {
  title: 'Удаление данных',
  updated: 'Обновлено: 20 октября 2026',
  intro:
    'Вы можете в любой момент попросить нас удалить данные, которые мы получили о вас через Instagram, Facebook, Threads или сайт: комментарии, сообщения, имя пользователя и ID аккаунта.',
  sections: [
    {
      h: 'Способ 1. Письмо',
      p: [
        'Напишите на ' + EMAIL + ' с темой «Удаление данных» и укажите ваше имя пользователя на платформе (например, ник в Instagram).',
        'Мы удалим из нашей базы все комментарии, сообщения и идентификаторы, связанные с этим именем, в течение 30 дней и подтвердим по email.',
      ],
    },
    {
      h: 'Способ 2. Удалить приложение в настройках Facebook или Instagram',
      p: [
        'Facebook: Настройки и конфиденциальность → Настройки → Приложения и сайты → «Asiia Autopost» → Удалить.',
        'Instagram: Настройки → Разрешения для сайтов → Приложения и сайты → «Asiia Autopost» → Удалить.',
        'После этого приложение больше не получает доступ к вашим данным. Чтобы стереть уже сохранённое, воспользуйтесь способом 1.',
      ],
    },
    {
      h: 'Что удаляется',
      p: [
        'Тексты комментариев и сообщений, имя пользователя и ID аккаунта, черновики наших ответов и записи об отправленных вам материалах. Ответы, которые доктор Виноград уже опубликовала под своими постами, тоже можно удалить по запросу.',
      ],
    },
    {
      h: 'Контакты',
      p: ['Вопросы: ' + EMAIL + '. Полная политика: drasiiavinograd.com/privacy.'],
    },
  ],
};

export default function DataDeletionPage() {
  return <LegalPage en={en} ru={ru} />;
}

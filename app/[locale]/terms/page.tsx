import LegalPage, { type LegalDoc } from '../../../components/LegalPage';

const EMAIL = 'usmleforimgs.drvinograd@gmail.com';

const en: LegalDoc = {
  title: 'Terms of Service',
  updated: 'Last updated: October 14, 2026',
  intro:
    'These terms apply to drasiiavinograd.com, our lectures, study materials and social media channels run by Dr. Asiia Vinograd. By using them you agree to these terms.',
  sections: [
    {
      h: 'Educational purpose only',
      p: [
        'All content is created for USMLE exam preparation and medical education. It is not medical advice and does not replace consultation with a doctor. Never use it to diagnose or treat yourself or others.',
      ],
    },
    {
      h: 'Use of materials',
      p: [
        'Lectures, notes, Anki decks and case reviews are for your personal study. You may not resell, republish or distribute paid materials without written permission. Free materials may be shared with a link to the source.',
      ],
    },
    {
      h: 'Accounts and subscriptions',
      p: [
        'You are responsible for keeping your account credentials safe. Paid access (USMLE Club) is provided through Patreon or the website and can be cancelled at any time; access continues until the end of the paid period.',
      ],
    },
    {
      h: 'Our social media tools',
      p: [
        'We use internal tools connected to official platform APIs (YouTube, Instagram, Facebook, Threads, TikTok, VK, Telegram) only to publish our own content to our own accounts. These tools are not offered to third parties. Use of each platform is also subject to that platform’s own terms.',
      ],
    },
    {
      h: 'No guarantees',
      p: [
        'We do our best to keep the content accurate and up to date, but exam results depend on many factors and are not guaranteed. The service is provided “as is”.',
      ],
    },
    {
      h: 'Changes and contact',
      p: [
        'We may update these terms; the date above shows the latest version. Questions: ' + EMAIL + '.',
      ],
    },
  ],
};

const ru: LegalDoc = {
  title: 'Условия использования',
  updated: 'Обновлено: 14 октября 2026',
  intro:
    'Эти условия действуют для сайта drasiiavinograd.com, лекций, учебных материалов и соцсетей доктора Асии Виноград. Пользуясь ими, вы соглашаетесь с условиями.',
  sections: [
    {
      h: 'Только для обучения',
      p: [
        'Все материалы созданы для подготовки к USMLE и медицинского образования. Это не медицинская консультация и не замена приёма у врача. Не используйте их для самодиагностики и самолечения.',
      ],
    },
    {
      h: 'Использование материалов',
      p: [
        'Лекции, конспекты, Anki-карточки и разборы задач — для личного обучения. Платные материалы нельзя перепродавать и распространять без письменного разрешения. Бесплатными можно делиться со ссылкой на источник.',
      ],
    },
    {
      h: 'Аккаунты и подписка',
      p: [
        'Вы отвечаете за сохранность своих данных для входа. Платный доступ (USMLE Club) оформляется через Patreon или сайт и отменяется в любой момент; доступ сохраняется до конца оплаченного периода.',
      ],
    },
    {
      h: 'Наши инструменты для соцсетей',
      p: [
        'Мы используем внутренние инструменты на официальных API платформ (YouTube, Instagram, Facebook, Threads, TikTok, ВКонтакте, Telegram) только для публикации нашего собственного контента в наших аккаунтах. Третьим лицам эти инструменты не предоставляются. Работа каждой платформы регулируется и её собственными правилами.',
      ],
    },
    {
      h: 'Без гарантий',
      p: [
        'Мы стараемся, чтобы материалы были точными и актуальными, но результат экзамена зависит от многих факторов и не гарантируется. Сервис предоставляется «как есть».',
      ],
    },
    {
      h: 'Изменения и контакты',
      p: ['Мы можем обновлять условия; дата выше — актуальная версия. Вопросы: ' + EMAIL + '.'],
    },
  ],
};

export default function TermsPage() {
  return <LegalPage en={en} ru={ru} />;
}

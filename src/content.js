// Everything a guest reads lives here: event facts, imagery and both languages.

export const EVENT = {
  // Tuesday 27 October 2026, 7:00 PM Cairo (UTC+3; Egypt's summer time ends on the 29th)
  start: new Date('2026-10-27T19:00:00+03:00'),
  end: new Date('2026-10-28T01:00:00+03:00'),
  venue: 'Tia Vie, Cairo, Egypt',
  maps: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Tia Vie, Cairo, Egypt'),
};

// Imagery: crops of image "1" (the arched lily invitation), which also sets the palette.
// The opening, the interlude and the closing use generated florals (src/art/flora.js) instead.
// Each entry: [file name in public/images without extension, intrinsic width, height]
export const IMAGES = {
  liliesSide: ['lilies-side', 204, 1280],
  liliesTop: ['lilies-top', 288, 540],
  liliesLow: ['lilies-low', 330, 350],
};

// The order of the evening. Minutes after midnight, used for the rolling numerals.
export const SCHEDULE = [
  { min: 20 * 60, key: 's1' },
  { min: 21 * 60, key: 's2' },
  { min: 22 * 60, key: 's3' },
  { min: 24 * 60, key: 's4' },
];

export const I18N = {
  en: {
    'meta.title': 'Mohammed Almonzer & Eman · 27.10.2026',
    'ui.lang': 'عربي',
    'ui.sound': 'Sound',
    'ui.scroll': 'Scroll to discover',

    'hero.kicker': 'The wedding of',
    'hero.first': 'Mohammed',
    'hero.second': 'Almonzer',
    'hero.and': '&',
    'hero.bride': 'Eman',
    'hero.date': 'Tuesday · 27.10.2026 · Cairo',

    'story.chapter': 'I · Prologue',
    'story.line1': 'Two families,',
    'story.line2': 'one story.',
    'story.caption': 'Together with their families, and with hearts full of gratitude.',

    'invite.chapter': 'II · The invitation',
    'invite.text': 'Together with their families, Mohammed Almonzer & Eman request the pleasure of your company as they begin a new chapter together.',

    'eve.chapter': 'III · The evening',
    'eve.day': 'Tuesday',
    'eve.month': 'October',
    'eve.year': '2026',
    'eve.time': 'Seven o’clock in the evening',
    'eve.days': 'days',
    'eve.hours': 'hours',
    'eve.minutes': 'minutes',
    'eve.until': 'until we celebrate',
    'eve.done': 'Tonight, we celebrate',

    'venue.chapter': 'IV · The venue',
    'venue.name': 'Tia Vie',
    'venue.place': 'Cairo, Egypt',
    'venue.when': 'Tuesday 27 October · 7:00 PM',
    'venue.directions': 'Directions',
    'venue.google': 'Google Calendar',
    'venue.apple': 'Apple Calendar',

    'sched.chapter': 'V · The order of the evening',
    's1': 'Reception', 's2': 'The zaffa', 's3': 'Dinner', 's4': 'The jertig',

        'msg.chapter': 'VI · A word from you',
    'msg.title': 'Leave us a few words',
    'msg.lead': 'Your wishes reach only the two of us.',
    'msg.name': 'Your name',
    'msg.message': 'Your message',
    'msg.send': 'Send',
    'msg.sending': 'Sending',
    'msg.needName': 'Please add your name.',
    'msg.needMsg': 'Please write a few words.',
    'msg.error': 'That didn’t go through. Please try again.',
    'msg.thanks': 'Thank you, {name}.',
    'msg.thanksSub': 'Your words have reached us. We can’t wait to see you.',

    'end.line': 'A new chapter together',
    'end.sign': 'With love',
  },

  ar: {
    'meta.title': 'محمد المنذر وإيمان · ٢٧.١٠.٢٠٢٦',
    'ui.lang': 'EN',
    'ui.sound': 'الصوت',
    'ui.scroll': 'مرّر لتكتشف',

    'hero.kicker': 'حفل زفاف',
    'hero.first': 'محمد',
    'hero.second': 'المنذر',
    'hero.and': 'و',
    'hero.bride': 'إيمان',
    'hero.date': 'الثلاثاء · ٢٧.١٠.٢٠٢٦ · القاهرة',

    'story.chapter': 'المقدّمة',
    'story.line1': 'عائلتان،',
    'story.line2': 'وحكايةٌ واحدة.',
    'story.caption': 'بكل الحب والسرور، ومع عائلتينا وقلوبٍ ملؤها الامتنان.',

    'invite.chapter': 'الدعوة',
    'invite.text': 'بكل الحب والسرور، ولأن فرحتنا أجمل بوجودكم، يتشرّف محمد المنذر وإيمان بدعوتكم لحضور حفل زفافهما، وبداية فصلٍ جديد معًا.',

    'eve.chapter': 'الأمسية',
    'eve.day': 'الثلاثاء',
    'eve.month': 'أكتوبر',
    'eve.year': '٢٠٢٦',
    'eve.time': 'الساعة السابعة مساءً',
    'eve.days': 'يوم',
    'eve.hours': 'ساعة',
    'eve.minutes': 'دقيقة',
    'eve.until': 'حتى نحتفل معًا',
    'eve.done': 'الليلة نحتفل',

    'venue.chapter': 'المكان',
    'venue.name': 'تيا ڤي',
    'venue.place': 'القاهرة، مصر',
    'venue.when': 'الثلاثاء ٢٧ أكتوبر · ٧:٠٠ مساءً',
    'venue.directions': 'الاتجاهات',
    'venue.google': 'تقويم Google',
    'venue.apple': 'تقويم Apple',

    'sched.chapter': 'برنامج الأمسية',
    's1': 'الاستقبال', 's2': 'الزفّة', 's3': 'العشاء', 's4': 'الجرتق',

        'msg.chapter': 'كلمة منكم',
    'msg.title': 'اتركوا لنا كلماتكم',
    'msg.lead': 'تهانيكم ودعواتكم تصلنا وحدنا.',
    'msg.name': 'اسمك',
    'msg.message': 'رسالتك',
    'msg.send': 'أرسل',
    'msg.sending': 'جارٍ الإرسال',
    'msg.needName': 'نرجو كتابة اسمك.',
    'msg.needMsg': 'نرجو كتابة رسالتك.',
    'msg.error': 'تعذّر الإرسال، حاول مرة أخرى.',
    'msg.thanks': 'شكرًا {name}.',
    'msg.thanksSub': 'وصلت كلماتك إلى قلوبنا، ونتطلع لرؤيتك.',

    'end.line': 'فصلٌ جديد معًا',
    'end.sign': 'مع الحب',
  },
};

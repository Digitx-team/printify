'use client';

export default function Marquee() {
  const items = [
    'Livraison 48h', 'خطة العمل الأولى', 'Custom Design', 'أغطية مخصصة',
    'iPhone · Samsung · Xiaomi', 'Qualité Premium', 'طباعة احترافية',
    'Livraison 48h', 'خطة العمل الأولى', 'Custom Design', 'أغطية مخصصة',
    'iPhone · Samsung · Xiaomi', 'Qualité Premium', 'طباعة احترافية',
  ];

  const renderItems = (prefix: string) =>
    items.map((text, i) => (
      <span
        key={`${prefix}-${i}`}
        className="inline-flex items-center gap-5 px-8 font-sans text-[11px] tracking-[0.15em] uppercase text-soft font-light whitespace-nowrap"
      >
        {text}
        <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
      </span>
    ));

  return (
    <div className="bg-ink py-[18px] overflow-hidden" dir="ltr">
      <div className="animate-marquee flex w-max">
        <div className="flex shrink-0">{renderItems('a')}</div>
        <div className="flex shrink-0" aria-hidden="true">{renderItems('b')}</div>
      </div>
    </div>
  );
}

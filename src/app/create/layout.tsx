import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أنشئ غطاءك | Create Your Case',
  description:
    'صمم غطاء هاتفك المخصص, اختر الموديل، ارفع صورتك، واطلب بسهولة. توصيل لكل ولايات الجزائر. Créez votre coque personnalisée en 3 étapes.',
  openGraph: {
    title: 'أنشئ غطاءك المخصص, PRINTIFY',
    description: 'صمم غطاء هاتفك بـ 3 خطوات بسيطة',
    url: 'https://casify.dz/create',
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

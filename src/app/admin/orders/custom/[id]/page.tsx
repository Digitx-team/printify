import CustomOrderDetail from "@/components/admin/orders/CustomOrderDetail";

interface CustomOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomOrderDetailPage({ params }: CustomOrderDetailPageProps) {
  const { id } = await params;
  return <CustomOrderDetail orderId={id} />;
}

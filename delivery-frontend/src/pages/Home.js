import CreateDeliveryForm from "../components/CreateDeliveryForm";
import UpdateStatusForm from "../components/UpdateStatusForm";
import DeliveryDetails from "../components/DeliveryDetails";

export default function Home() {
  return (
    <div className="space-y-10">
      <CreateDeliveryForm />
      <UpdateStatusForm />
      <DeliveryDetails />
    </div>
  );
}

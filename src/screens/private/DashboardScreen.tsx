import {Calendar} from '../../components/ui/calendar'

const DashboardScreen = () => {
  return (
    <main className="min-h-screen w-screen overflow-hidden">
        <div className="flex items-center justify-center w-full h-full">
            <Calendar />
        </div>
    </main>
  );
}

export default DashboardScreen;
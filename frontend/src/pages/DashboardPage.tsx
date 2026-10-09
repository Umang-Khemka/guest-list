import ActionRow from "../components/dashboard/ActionRow";
import QuickActions from "../components/dashboard/QuickActions";
import StatCard from "../components/dashboard/StatCard";
import TripCard from "../components/dashboard/TripCard";
import { useDashboardData } from "../hooks/useDashboardData";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { stats, arrivals, departures, needsAction } = useDashboardData();

  return (
    <div className="page">
      <h1 className="page__title">Good to see you</h1>
      <p className="page__sub">Everything for the wedding, family by family.</p>

      <QuickActions />

      <div className="stat-grid">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="trip-columns">
        <section>
          <h2 className="dash-heading">Arriving today ({arrivals.length})</h2>
          <div className="dash-list">
            {arrivals.map((t) => (
              <TripCard key={t.family._id} kind="arrival" {...t} />
            ))}
            {arrivals.length === 0 && <p className="muted">No arrivals today.</p>}
          </div>
        </section>

        <section>
          <h2 className="dash-heading">Leaving today ({departures.length})</h2>
          <div className="dash-list">
            {departures.map((t) => (
              <TripCard key={t.family._id} kind="departure" {...t} />
            ))}
            {departures.length === 0 && <p className="muted">No departures today.</p>}
          </div>
        </section>
      </div>

      <h2 className="dash-heading">Needs action ({needsAction.length})</h2>
      <div className="action-grid">
        {needsAction.map((item) => (
          <ActionRow key={item.family._id} {...item} />
        ))}
        {needsAction.length === 0 && <p className="muted">Nothing needs action right now.</p>}
      </div>
    </div>
  );
}
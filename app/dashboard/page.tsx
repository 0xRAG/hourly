"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/app/components/AppLayout";
import ProgressCircle from "@/app/components/ProgressCircle";
import HourEntry from "@/app/components/HourEntry";

interface HourEntryData {
  id: string;
  date: string;
  hours: number;
  type: "DBQ" | "Supervision" | "Direct";
  clientInitials?: string;
}

interface DashboardData {
  entries: HourEntryData[];
  totalHours: number;
  directDbqHours: number;
  supervisionHours: number;
  targetHours: number;
  targetSupervisionHours: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/hours");

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="loading">Loading your hours...</div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="error-message">{error}</div>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout>
        <div className="error-message">No data available</div>
      </AppLayout>
    );
  }

  const recentEntries = data.entries.slice(0, 10); // Show last 10 entries

  return (
    <AppLayout showLogout={true}>
      <div className="dashboard">
        <div className="progress-section">
          <div className="dual-progress">
            <div className="progress-item">
              <ProgressCircle
                current={data.directDbqHours}
                target={data.targetHours}
                size={180}
              />
              <div className="progress-info">
                <h3>Direct Hours</h3>
                <p>
                  {data.directDbqHours} of {data.targetHours} hours completed
                </p>
                {data.directDbqHours >= data.targetHours ? (
                  <p className="goal-achieved">🎉 Goal achieved!</p>
                ) : (
                  <p className="hours-remaining">
                    {data.targetHours - data.directDbqHours} hours remaining
                  </p>
                )}
              </div>
            </div>

            <div className="progress-item">
              <ProgressCircle
                current={data.supervisionHours}
                target={data.targetSupervisionHours}
                size={180}
              />
              <div className="progress-info">
                <h3>Supervision Hours</h3>
                <p>
                  {data.supervisionHours} of {data.targetSupervisionHours} hours
                  completed
                </p>
                {data.supervisionHours >= data.targetSupervisionHours ? (
                  <p className="goal-achieved">🎉 Goal achieved!</p>
                ) : (
                  <p className="hours-remaining">
                    {data.targetSupervisionHours - data.supervisionHours} hours
                    remaining
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <Link href="/add-hours" className="add-hours-btn">
            + Add Hours
          </Link>
        </div>

        <div className="entries-section">
          <h3>Recent Entries</h3>
          {recentEntries.length === 0 ? (
            <div className="no-entries">
              <p>No hour entries yet.</p>
              <Link href="/add-hours" className="auth-link">
                Add your first entry
              </Link>
            </div>
          ) : (
            <div className="entries-list">
              {recentEntries.map((entry) => (
                <HourEntry
                  key={entry.id}
                  date={entry.date}
                  hours={entry.hours}
                  type={entry.type}
                  clientInitials={entry.clientInitials}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

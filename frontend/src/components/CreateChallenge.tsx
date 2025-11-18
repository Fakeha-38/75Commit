import {useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setName,
  setStartDate,
  setDaysPerWeekTarget,
  setWeekdays,
  resetChallenge,
} from "../redux/challenge/challengeSlice";
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";
console.log("CreateChallenge: START");
const weekdays = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export default function CreateChallenge() {
  const dispatch = useAppDispatch();
  const { name, startDate, daysPerWeekTarget, weekdays: selectedDays, type, durationDays } = useAppSelector(
    (state) => state.challenge
  );
  const [loading, setLoading] = useState(false);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      dispatch(setWeekdays(selectedDays.filter((d) => d !== day)));
    } else if (selectedDays.length < daysPerWeekTarget) {
      dispatch(setWeekdays([...selectedDays, day]));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("challenges")
      .insert([
        {
          name,
          start_date: startDate,
          days_per_week_target: daysPerWeekTarget,
          duration_days: durationDays,
        },
      ])
      .select()
      .single();

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    if (daysPerWeekTarget < 7 && selectedDays.length === daysPerWeekTarget) {
      const weekdayInserts = selectedDays.map((day) => ({
        challenge_id: data.id,
        weekday: day,
      }));

      const { error: weekdayError } = await supabase
        .from("challenge_weekdays")
        .insert(weekdayInserts);

      if (weekdayError) {
        setLoading(false);
        alert(weekdayError.message);
        return;
      }
    }

    setLoading(false);
    alert("Challenge created!");
    dispatch(resetChallenge());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Create a New Challenge</h2>
      <fieldset disabled={loading} className="space-y-4">
        <label htmlFor="challengeName" className="block text-sm font-semibold">Challenge Name</label>
        <input
          id="challengeName"
          type="text"
          placeholder="Challenge Name"
          value={name}
          onChange={(e) => dispatch(setName(e.target.value))}
          className="w-full p-2 border rounded"
          required
        />
        <label htmlFor="startDate" className="block text-sm font-semibold">Start Date</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => dispatch(setStartDate(e.target.value))}
          min={new Date().toISOString().split("T")[0]}
          className="w-full p-2 border rounded"
          required
        />
        <p htmlFor="daysPerWeek" className="block text-sm font-semibold">Days per Week Target</p>
        <input
          id="daysPerWeek"
          type="number"
          min={1}
          max={7}
          value={daysPerWeekTarget}
          onChange={(e) => {
            dispatch(setDaysPerWeekTarget(Number(e.target.value)));
            dispatch(setWeekdays([]));
          }}
          className="w-full p-2 border rounded"
          required
        />
        <p className="text-sm italic text-gray-500">This is a <strong>75{type}</strong> challenge</p>

        {daysPerWeekTarget < 7 && (
          <div>
            <p className="font-semibold">Select {daysPerWeekTarget} days:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {weekdays.map((day) => (
                <label key={day} className="flex items-center space-x-1 capitalize">
                  <input
                    type="checkbox"
                    value={day}
                    checked={selectedDays.includes(day)}
                    onChange={() => toggleDay(day)}
                    disabled={
                      !selectedDays.includes(day) &&
                      selectedDays.length >= daysPerWeekTarget
                    }
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </fieldset>
      <button
        type="submit"
        disabled={
          loading ||
          (daysPerWeekTarget < 7 && selectedDays.length !== daysPerWeekTarget)
        }
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : "Create Challenge"}
      </button>
    </form>
  );
}
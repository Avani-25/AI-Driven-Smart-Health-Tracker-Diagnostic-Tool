import React, { useState } from "react";
import { UserProfile } from "../types";
import { User, Activity, AlertTriangle, ShieldCheck, HeartPulse } from "lucide-react";

interface ProfileFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export default function ProfileForm({ initialProfile, onSave }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setProfile((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} id="profile-form" className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Demographic & Basic Info</h3>
            <p className="text-xs text-slate-500">Core personal criteria for risk analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Age (Years)</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              min="1"
              max="120"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Biological Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800 bg-white"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Physical Activity Level</label>
            <select
              name="activityLevel"
              value={profile.activityLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800 bg-white"
              required
            >
              <option value="Sedentary">Sedentary (No regular exercise)</option>
              <option value="Light">Light (1-2 days/week light workout)</option>
              <option value="Moderate">Moderate (3-4 days/week training)</option>
              <option value="Active">Active (5+ days/week intense activity)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Dietary Preference</label>
            <input
              type="text"
              name="dietaryPreference"
              value={profile.dietaryPreference}
              onChange={handleChange}
              placeholder="e.g. Low sodium, Vegan, Balanced"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Clinical History & Genetics</h3>
            <p className="text-xs text-slate-500">Predispositions and existing treatments</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Existing Conditions</label>
            <input
              type="text"
              name="existingConditions"
              value={profile.existingConditions}
              onChange={handleChange}
              placeholder="e.g. Asthma, Hyperlipidemia, none"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Heritable Family Medical History</label>
            <textarea
              name="familyHistory"
              value={profile.familyHistory}
              onChange={handleChange}
              placeholder="e.g. Father had heart attack at 50, Mother has high BP"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800 h-16"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Allergies</label>
              <input
                type="text"
                name="allergies"
                value={profile.allergies}
                onChange={handleChange}
                placeholder="e.g. Penicillin, Peanuts, None"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Current Medications</label>
              <input
                type="text"
                name="medications"
                value={profile.medications}
                onChange={handleChange}
                placeholder="e.g. Metformin 500mg, Lisinopril 10mg"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Lifestyle Risks</h3>
            <p className="text-xs text-slate-500">Voluntary habits affecting cardiovascular wellness</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Tobacco/Smoking Habits</label>
            <label className="relative flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="smoke"
                checked={profile.smoke}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="text-sm text-slate-700">I consume tobacco or cigarette products</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Alcohol Consumption</label>
            <select
              name="alcohol"
              value={profile.alcohol}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800 bg-white"
            >
              <option value="No">No / Never</option>
              <option value="Occasional">Occasional / Socially</option>
              <option value="Regular">Regularly (Multiple times per week)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 items-center">
        {isSaved && (
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" /> Profile saved successfully!
          </span>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm transition-all duration-150"
        >
          Save Clinical Profile
        </button>
      </div>
    </form>
  );
}

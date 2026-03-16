"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LostPersonGender } from "@/types/lostPerson";

type LostPersonFormValues = {
  fullName: string;
  age: string;
  gender: LostPersonGender;
};

type LostPersonFormProps = {
  formData: LostPersonFormValues;
  isSubmitting: boolean;
  message: string;
  onChange: (values: LostPersonFormValues) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export function LostPersonForm({
  formData,
  isSubmitting,
  message,
  onChange,
  onSubmit,
}: LostPersonFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm mb-1">
          Full Name
        </label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(event) =>
            onChange({ ...formData, fullName: event.target.value })
          }
          required
        />
      </div>

      <div>
        <label htmlFor="age" className="block text-sm mb-1">
          Age
        </label>
        <Input
          id="age"
          type="number"
          min={0}
          max={120}
          value={formData.age}
          onChange={(event) =>
            onChange({ ...formData, age: event.target.value })
          }
          required
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm mb-1">
          Gender
        </label>
        <select
          id="gender"
          value={formData.gender}
          onChange={(event) =>
            onChange({
              ...formData,
              gender: event.target.value as LostPersonGender,
            })
          }
          className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </Button>

      {message ? <p className="text-sm text-primary">{message}</p> : null}
    </form>
  );
}

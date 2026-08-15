export const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

export const isSameDay = (isoA: string, isoB: string): boolean =>
    new Date(isoA).toDateString() === new Date(isoB).toDateString();

// Today's date as "YYYY-MM-DD" in local time, e.g. for defaulting a <input type="date">.
export const getTodayDateString = (): string => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
};

// Inclusive range check; an empty from/to bound is treated as unbounded.
export const isWithinDateRange = (iso: string, from: string, to: string): boolean => {
    const time = new Date(iso).getTime();
    if (from && time < new Date(from).getTime()) return false;
    if (to && time > new Date(`${to}T23:59:59.999`).getTime()) return false;
    return true;
};

export const calculateAge = (dateOfBirth: string): number => {
    const dob = new Date(dateOfBirth);
    const now = new Date();

    let age = now.getFullYear() - dob.getFullYear();
    const hasHadBirthdayThisYear =
        now.getMonth() > dob.getMonth() ||
        (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());

    if (!hasHadBirthdayThisYear) age -= 1;
    return age;
};

// Age as of a given date (e.g. a consultation date), broken into years/months.
export const calculateAgeAtDate = (
    dateOfBirth: string,
    atDate: string
): { years: number; months: number } => {
    const dob = new Date(dateOfBirth);
    const at = new Date(atDate);

    let years = at.getFullYear() - dob.getFullYear();
    let months = at.getMonth() - dob.getMonth();

    if (at.getDate() < dob.getDate()) months -= 1;
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months };
};

// "5 months" under a year old, otherwise "1 year, 2 months" (omitting the months part when it's 0).
export const formatAgeAtDate = (dateOfBirth: string, atDate: string): string => {
    const { years, months } = calculateAgeAtDate(dateOfBirth, atDate);

    if (years <= 0) return `${months} ${months === 1 ? 'month' : 'months'}`;

    const yearsLabel = `${years} ${years === 1 ? 'year' : 'years'}`;
    if (months === 0) return yearsLabel;

    return `${yearsLabel}, ${months} ${months === 1 ? 'month' : 'months'}`;
};

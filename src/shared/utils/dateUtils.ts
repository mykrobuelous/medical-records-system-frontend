export const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

export const isSameDay = (isoA: string, isoB: string): boolean =>
    new Date(isoA).toDateString() === new Date(isoB).toDateString();

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

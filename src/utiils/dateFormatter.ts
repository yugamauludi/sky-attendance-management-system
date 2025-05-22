export const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = date.toLocaleString("id-ID", {
        month: "long",
        timeZone: "UTC",
    });
    const year = date.getUTCFullYear();
    const weekday = date.toLocaleString("id-ID", {
        weekday: "long",
        timeZone: "UTC",
    });

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${weekday}, ${day} ${month} ${year} ${hours}.${minutes}.${seconds}`;
};
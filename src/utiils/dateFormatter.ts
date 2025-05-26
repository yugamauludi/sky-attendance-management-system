export const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = date.toLocaleString("id-ID", {
        month: "long",
        timeZone: "UTC",
    });
    const year = date.getUTCFullYear();
    // const weekday = date.toLocaleString("id-ID", {
    //     weekday: "long",
    //     timeZone: "UTC",
    // });

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    // const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}`;
};

export function formatDateUTC(isoString: string | null | undefined): string | undefined {
    if (!isoString) return "-";

    const date = new Date(isoString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = date.toLocaleString('id-ID', { month: 'long', timeZone: 'UTC' });
    const year = date.getUTCFullYear();

    return `${day} ${month} ${year}`;
}

export function formatTanggalWIB(isoDate: string): string {
    if (!isoDate) return "-";
    const date = new Date(isoDate);

    return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Jakarta",
    });
}

export function getJamWIB(isoString: string): string {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} WIB`;
}

export function formatTanggalPendekWIB(isoDate: string): string {
    try {
        if (!isoDate) return "-";

      return new Date(isoDate).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      });
    } catch {
      return "-";
    }
  }
  
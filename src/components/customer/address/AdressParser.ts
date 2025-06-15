export function parseAddress(addressString: string): {
    postcode?: string;
    city?: string;
    country?: string;
    road?: string;
} {
    const parts = addressString.split(', ');
    const result: {
        postcode?: string;
        city?: string;
        country?: string;
        road?: string;
    } = {};
    result.country = parts.pop();

    // Si le dernier élément restant contient "métropolitaine", on le considère comme faisant partie du pays
    if (parts.length > 0 && parts[parts.length - 1].toLowerCase().includes('métropolitaine')) {
        result.country = `${parts.pop()}, ${result.country}`;
    }

    if (parts.length > 0) {
        result.city = parts.shift();
    }

    // S'il reste des éléments, le dernier pourrait être un code postal
    if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];
        if (/^\d+$/.test(lastPart)) {
            result.postcode = parts.pop();
        }
    }

    // S'il reste quelque chose, on le considère comme la rue
    if (parts.length > 0) {
        result.road = parts.join(', ');
    }

    return result;
}
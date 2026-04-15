export default async function handler(req, res) {
    const ip = req.query.ip || "8.8.8.8";

    const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.IPIFY_KEY}&ipAddress=${ip}`
    );

    const data = await response.json();

    res.status(200).json(data);
}

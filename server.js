const express = require("express");
const axios = require("axios");
const request = require("request");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// 🎶 Search for Songs
app.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "❌ No query provided!" });
    }

    try {
        const response = await axios.get(`https://saavn.dev/api/search/songs?query=${query}`);
        if (!response.data || response.data.results.length === 0) {
            return res.status(404).json({ error: "❌ No songs found!" });
        }
        res.json(response.data);
    } catch (error) {
        console.error("❌ API Error:", error.message);
        res.status(500).json({ error: "Failed to fetch song data. Check logs for more info!" });
    }
});

// 🎵 Get Song Details & Download Link
app.get("/song/:id", async (req, res) => {
    const songId = req.params.id;

    try {
        const response = await axios.get(`https://saavn.dev/api/songs/${songId}`);
        const songData = response.data;

        if (!songData || !songData.download_url) {
            return res.status(404).json({ error: "❌ Song not found or missing download URL!" });
        }

        res.json({
            title: songData.title,
            artist: songData.primary_artists,
            album: songData.album.name,
            duration: songData.duration,
            release_date: songData.release_date,
            download_url: songData.download_url
        });
    } catch (error) {
        console.error("❌ API Error:", error.message);
        res.status(500).json({ error: "Failed to fetch song details. Check logs for more info!" });
    }
});

// 🔊 Stream Song Directly
app.get("/stream/:id", async (req, res) => {
    const songId = req.params.id;

    try {
        const response = await axios.get(`https://saavn.dev/api/songs/${songId}`);
        const songData = response.data;

        if (!songData || !songData.download_url) {
            return res.status(404).json({ error: "❌ No streamable URL found!" });
        }

        request(songData.download_url).pipe(res); // Stream song file to client
    } catch (error) {
        console.error("❌ API Error:", error.message);
        res.status(500).json({ error: "Failed to stream song. Check API response or logs!" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

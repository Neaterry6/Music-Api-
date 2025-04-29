const express = require("express");
const axios = require("axios");

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
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch song data." });
    }
});

// 📥 Get Song Details & Download Link
app.get("/song/:id", async (req, res) => {
    const songId = req.params.id;

    try {
        const response = await axios.get(`https://saavn.dev/api/songs/${songId}`);
        const songData = response.data;
        
        res.json({
            title: songData.title,
            artist: songData.primary_artists,
            album: songData.album.name,
            duration: songData.duration,
            release_date: songData.release_date,
            download_url: songData.download_url
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch song details." });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
})

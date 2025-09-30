// dataset team_resources - akan di-generate dari talentsData
let x_train = [];

// Fungsi untuk menginisialisasi x_train dari talentsData
function initializeXtrain() {
    const skillOrder = [
        "Computer Vision",
        "Classification & Regression", 
        "Forecasting / Time-series",
        "EDA & Visualization",
        "NLP",
        "Speech / Audio",
        "Data Engineering",
        "Deployment",
        "Front End",
        "Back End",
        "MLOps",
        "Tech Writer"
    ];

    x_train = talentsData.map(talent => {
        return skillOrder.map(skill => talent.skills[skill] || 0);
    });
}

// Enhanced Euclidean similarity (semakin dekat semakin baik)
function calculateEnhancedSimilarity(userSkills, talentSkills) {
    let similarity = 0;
    let totalWeights = 0;
    
    for (let i = 0; i < userSkills.length; i++) {
        const userValue = userSkills[i];
        const talentValue = talentSkills[i] / 100; // Convert to 0-1
        
        if (userValue > 0) {
            // Semakin dekat nilai talent dengan yang diinginkan user, semakin tinggi similarity
            const skillSimilarity = 1 - Math.abs(userValue - talentValue);
            const weightedSimilarity = skillSimilarity * userValue;
            
            similarity += weightedSimilarity;
            totalWeights += userValue;
        }
    }
    
    if (totalWeights === 0) return 0.1; // Minimum opacity
    
    return Math.max(0.1, similarity / totalWeights);
}

// mendapatkan similarity scores untuk semua talent
function getAllSimilarities(train, userSkills) {
    const similarities = [];
    
    for (let n = 0; n < train.length; n++) {
        const similarity = calculateEnhancedSimilarity(userSkills, train[n]);
        similarities.push(similarity);
    }
    
    return similarities;
}

//menjalankan inputan
async function processData() {
    // Inisialisasi x_train jika belum ada
    if (x_train.length === 0) {
        initializeXtrain();
    }

    // Get slider values
    const userSkills = [
        document.getElementById("cv").value / 100,
        document.getElementById("regresi").value / 100,
        document.getElementById("timeseries").value / 100,
        document.getElementById("eda").value / 100,
        document.getElementById("nlp").value / 100,
        document.getElementById("speech").value / 100,
        document.getElementById("data").value / 100,
        document.getElementById("deploy").value / 100,
        document.getElementById("fe").value / 100,
        document.getElementById("be").value / 100,
        document.getElementById("mlops").value / 100,
        document.getElementById("writer").value / 100
    ];

    // Calculate similarities
    const similarities = getAllSimilarities(x_train, userSkills);
    
    // Normalize similarities untuk visual yang baik
    const minSimilarity = Math.min(...similarities);
    const maxSimilarity = Math.max(...similarities);
    
    const normalizedSimilarities = similarities.map(sim => {
        if (maxSimilarity === minSimilarity) return 0.5; // Default jika semua sama
        
        // Normalize to 0.1-1.0 range
        const normalized = 0.1 + 0.9 * ((sim - minSimilarity) / (maxSimilarity - minSimilarity));
        return Math.max(0.1, Math.min(1.0, normalized));
    });

    // Update opacity untuk semua talent images
    const talentImgs = document.querySelectorAll('.talent-img');
    talentImgs.forEach((img, index) => {
        if (index < normalizedSimilarities.length) {
            img.style.opacity = normalizedSimilarities[index];
        }
    });
}

function reset() {
    // Reset sliders
    const sliders = ["cv", "regresi", "timeseries", "eda", "nlp", "speech", "data", "deploy", "fe", "be", "mlops", "writer"];
    sliders.forEach(sliderId => {
        document.getElementById(sliderId).value = 0;
    });
    
    // Reset slider value displays
    for (let i = 1; i <= 12; i++) {
        document.getElementById(`value${i}`).innerHTML = 0;
    }

    // Reset opacity untuk semua talent images ke kondisi awal
    const talentImgs = document.querySelectorAll('.talent-img');
    talentImgs.forEach(img => {
        img.style.opacity = 0.5;
    });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initializeXtrain();
    
    // Set initial opacity untuk semua talent
    const talentImgs = document.querySelectorAll('.talent-img');
    talentImgs.forEach(img => {
        img.style.opacity = 0.5;
    });
});
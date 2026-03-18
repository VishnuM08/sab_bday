const fs = require('fs-extra');
const path = require('path');

const dataFile = path.join(__dirname, '../public/data.json');

const captions = [
    "Nanbanukku kovam varalam... aana dhrogham panna koodadhu! (Natpukkaga) 🤝",
    "Mustafa Mustafa Don't Worry Mustafa! (Kadhal Desam) 🎶",
    "En friends-a pola yaaru machan? (Nanban) 😎",
    "Oru nalla nanban kidaipadhu... (Nanban) ❤️",
    "Natpu na enna nu theriyuma? (Friends) 🌟",
    "Thozhanin tholgal... (Thalapathi) 💪",
    "Machan... nee azhaga irukka da! (Boss Engira Baskaran) 😜",
    "Friendship-kku vayasu kidayathu! ✨",
    "Namakku soru mukkiyam illa... Natpu dhaan mukkiyam! 🤣",
    "Ladies Ranavapadei! (As requested!) 💃 ✨",
    "Aambalaikum pombalaikum natpu vandha... (Kushi) 😉",
    "Unakkaga uyiraye tharuven da! 🔥",
    "Natpukku ellam theriyum... aana onnume theriyadhu. 🧩",
    "Namma natpu...vera level! 🚀",
    "Snehidhane Snehidhane... (Alaipayuthey) 🎵",
    "Nanban oruvan vandha piragu... (Nanban) 🌅",
    "Kaatru... Vaanam... Natpu... (Snehithane) 🍃",
    "Pasanga paasam vacha... (Nadodigal) 😂",
    "Gang Gang! (Tamil style) 🤟",
    "Nee illana naan illa da! ❤️",
    "Oru friend-a pol... (Nanban) 🤞",
    "Dosthu bada dosthu! (Saroja) 🕺",
    "Taxi Taxi... Nanba! (Sakkarakatti) 🚕",
    "Natpukku grammer theriyadhu! 📚",
    "Va da maplai! 🤵",
    "Seri va... polam! (Vada Chennai style) 🚶‍♂️",
    "Ladies Ranavapadei! 💃 ✨",
    "Singam single-a dhaan varum... aana namma kootama varuvom! 🦁",
    "Thalaiva! (General) 👑",
    "Friendship is divine! (Boys) ✨",
    "Macha, one tea? ☕",
    "Treat eppo? 🎂",
    "Vettaiyaadu Vilaiyaadu! 🎮",
    "Pudhu maplai... pudhu ponnu! (Just kidding) 😜",
    "Namma gethu! 😎"
];

async function updateCaptions() {
    try {
        const data = await fs.readJson(dataFile);

        // Shuffle captions slightly or just assign sequentially
        // Let's assign sequentially to ensure variety
        const updatedData = data.map((item, index) => {
            return {
                ...item,
                caption: captions[index % captions.length] // Cycle through if more images than captions
            };
        });

        await fs.writeJson(dataFile, updatedData, { spaces: 2 });
        console.log('Captions updated successfully!');
    } catch (err) {
        console.error(err);
    }
}

updateCaptions();

const mongoose = require('mongoose');
const Product = require('./models/Product'); // Make sure this path matches your folder structure

// 1. Connect to your local MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/kikoDB')
    .then(() => console.log('MongoDB Connected for Seeding...'))
    .catch(err => console.log('Database connection error:', err));

// 2. Array of 30 Realistic Kiko Milano Products
const kikoProducts = [
    // --- LIPS ---
    { name: "3D Hydra Lipgloss", price: 6210, category: "LIPS", image: "hydrategloss.png", rating: 4.8, stock: 50, description: "Softening lip gloss for a shiny, plumped look." },
    { name: "Smart Fusion Lipstick", price: 2910, category: "LIPS", image: "smartlips.png", rating: 4.5, stock: 30, description: "Rich, nourishing lipstick with a bright finish." },
    { name: "Velvet touch Lipstick", price: 3700, category: "LIPS", image: "velvet.png", rating: 4.2, stock: 100, description: "Comfortable, moisturizing lipstick with a velvety touch." },
    { name: "Velvet Passion Matte LipGloss", price: 4200, category: "LIPS", image: "gloss.png", rating: 4.6, stock: 45, description: "Comfortable matte lip gloss with intense color payout." },
    { name: "2 in 1 Creamy Gloss", price: 4500, category: "LIPS", image: "creamygloss.png", rating: 4.7, stock: 15, description: "Versatile 2-in-1 creamy gloss for a luminous, hydrated finish." },
    { name: "Creamy Lip Liner", price: 2100, category: "LIPS", image: "lipliner.png", rating: 4.3, stock: 80, description: "Smooth and precise lip pencil." },

    // --- EYES ---
    { name: "Water Eyeshadow", price: 4500, category: "EYES", image: "waterShadow.png", rating: 4.7, stock: 40, description: "Instant color eyeshadow for wet and dry use." },
    { name: "Maxi Mod Mascara", price: 5200, category: "EYES", image: "highMascara.png", rating: 4.6, stock: 60, description: "Mascara with a mini brush for maximum volume." },
    { name: "Lasting Precision Eyeliner", price: 3200, category: "EYES", image: "brownliner.png", rating: 4.4, stock: 85, description: "Automatic eye pencil for the inner and outer eye." },
    { name: "Ultra thin wand Mascara", price: 3800, category: "EYES", image: "thin.png", rating: 4.1, stock: 55, description: "Precision mascara with an ultra-thin wand for flawless definition." },
    { name: "4 in 1 Eyeshadow", price: 5500, category: "EYES", image: "multiShadow.png", rating: 4.8, stock: 25, description: "Versatile 4-in-1 eyeshadow palette for highly pigmented eye looks." },
    { name: "Precision Eyebrow Pencil", price: 2800, category: "EYES", image: "browPencil.png", rating: 4.5, stock: 40, description: "Micro-precision pencil for defined brows." },
    { name: "High Pigment Eyeshadow", price: 3100, category: "EYES", image: "glitterShadow.png", rating: 4.2, stock: 70, description: "Highly pigmented wet and dry eyeshadow." },
    { name: "High Pigment multi Eyeshadow", price: 3400, category: "EYES", image: "multiShadow.png", rating: 4.0, stock: 50, description: "Multi-shade highly pigmented eyeshadow for dimensional looks." },
    { name: "Ultra thick Mascara", price: 3000, category: "EYES", image: "standoutMascara.png", rating: 4.6, stock: 80, description: "Make your eyelashes ultra thick and voluminous." },
    { name: "Suoer thind wand Mascara", price: 3500, category: "EYES", image: "superthinMascara.png", rating: 4.9, stock: 15, description: "Highly pigmented mascara with a super thin wand for maximum control." },

    // --- FACE ---
    { name: "Ultra Glow strobe cream", price: 7100, category: "FACE", image: "strobecream.png", rating: 4.4, stock: 25, description: "Illuminating strobe cream for a radiant, ultra-glow finish." },
    { name: "Radiant Touch Blush", price: 4800, category: "FACE", image: "liquidblush.png", rating: 4.5, stock: 35, description: "Luminous blush for a radiant complexion." },
    { name: "Weightless Powder Foundation", price: 8500, category: "FACE", image: "facepowder.png", rating: 4.9, stock: 12, description: "Wet and dry powder foundation with matte finish." },
    { name: "Liquid Skin blush", price: 9200, category: "FACE", image: "skintint.png", rating: 4.7, stock: 18, description: "Second-skin effect liquid blush for a natural flush." },
    { name: "Glitter Face blush", price: 6500, category: "FACE", image: "glitterblush.png", rating: 4.3, stock: 30, description: "Sparkling face blush for a glamorous, glowing complexion." },
    { name: "Sculpting Touch Cream Contour", price: 5400, category: "FACE", image: "sculpttouch.png", rating: 4.8, stock: 22, description: "Contouring stick with a matte finish." },

    // --- SKIN CARE ---
    { name: "Skin Trainer Serum", price: 12000, category: "SKIN CARE", image: "trainer.png", rating: 4.9, stock: 15, description: "Youth-generating serum." },
    { name: "Anti fatique face Mask", price: 3500, category: "SKIN CARE", image: "fatigue.png", rating: 4.3, stock: 80, description: "Revitalizing face mask to combat signs of fatigue and refresh skin." },
    { name: "Hydra Pro Day Mask", price: 10500, category: "SKIN CARE", image: "hydrate.png", rating: 4.7, stock: 20, description: "Deeply moisturizing day mask for prolonged hydration." },
    { name: "Black Clay Mask", price: 8900, category: "SKIN CARE", image: "clayMask.png", rating: 4.5, stock: 28, description: "Purifying black clay mask to cleanse and refine pores." },
    { name: "Intensive Night Youth Serum", price: 2900, category: "SKIN CARE", image: "nightserum.png", rating: 4.6, stock: 90, description: "Overnight intensive serum to rejuvenate and restore youthful skin." },
    { name: "Bright Lift Serum", price: 3200, category: "SKIN CARE", image: "liftserum.png", rating: 4.7, stock: 67, description: "Lifting and brightening serum for a radiant, firm complexion." },

    // --- ACCESSORIES ---
    { name: "Precision Make-up Blender", price: 2500, category: "ACCESSORIES", image: "sponge.png", rating: 4.8, stock: 150, description: "Sponge for applying fluid and cast foundations." },
    { name: "Face 102 Blush Brush", price: 4200, category: "ACCESSORIES", image: "blushbrush.png", rating: 4.4, stock: 40, description: "Tapered brush for applying and blending blush." },
    { name: "Eyes 51 Shader Brush", price: 3100, category: "ACCESSORIES", image: "powderbrush.png", rating: 4.5, stock: 65, description: "Flat brush for applying concealer and eyeshadow." },
    { name: "Eyelash Curlur", price: 2800, category: "ACCESSORIES", image: "curler.png", rating: 4.7, stock: 85, description: "Professional eyelash curler." },
    { name: "Face powder Sponges Set", price: 1800, category: "ACCESSORIES", image: "powdersponges.png", rating: 4.7, stock: 85, description: "Set of soft sponges for flawless face powder application." },
    { name: "Mini Manicure Set", price: 4800, category: "ACCESSORIES", image: "manicure.png", rating: 4.7, stock: 85, description: "Travel-friendly mini manicure set for perfect nails on the go." },
    { name: "Tweezer", price: 2000, category: "ACCESSORIES", image: "tweezer.png", rating: 4.7, stock: 85, description: "High-precision tweezers for flawless brow shaping." },
    // ... your existing accessories ...

    // --- HAIR ---
    { name: "Nourishing Hair Oil", price: 4500, category: "HAIR", image: "hairoil.png", rating: 4.8, stock: 40, description: "Restorative hair oil for silky, shiny hair." },
    { name: "Volume Hair Spray", price: 3200, category: "HAIR", image: "hairspray.png", rating: 4.5, stock: 55, description: "Lightweight spray for long-lasting volume." },
    { name: "Repairing Hair Mask", price: 5100, category: "HAIR", image: "hairmask.png", rating: 4.9, stock: 25, description: "Intense repair mask for damaged hair." },
    { name: "Hair Nourishing Shampoo", price: 5000, category: "HAIR", image: "shampoo.png", rating: 4.6, stock: 30, description: "Intense repair hair shampoo for damaged hair." },
    { name: "Dry hair serum", price: 7000, category: "HAIR", image: "dryserum.png", rating: 4.9, stock: 49, description: "Dry hair serum for healthy and glossy hair." },

    // --- FRAGRANCE ---
    { name: "Velvet Passion Eau De Parfum", price: 15500, category: "FRAGRANCE", image: "colonne.png", rating: 4.9, stock: 15, description: "Elegant floral fragrance with woody notes." },
    { name: "Ocean Breeze Body Mist", price: 42200, category: "FRAGRANCE", image: "purple.png", rating: 4.6, stock: 60, description: "Refreshing daily body mist." },
    { name: "Midnight Musk Perfume", price: 18000, category: "FRAGRANCE", image: "red.png", rating: 4.8, stock: 10, description: "Intense, long-lasting evening fragrance." },
    { name: "Scent of Milan Eau", price: 22000, category: "FRAGRANCE", image: "floralfruity.png", rating: 4.9, stock: 10, description: "Intense, long-lasting evening fragrance." },
    { name: "Scent of Milan Eau Barera District", price: 18000, category: "FRAGRANCE", image: "milaneau.png", rating: 4.8, stock: 55, description: "Intense, long-lasting day fragrance." }

];

// 3. Inject the Data
async function seedDatabase() {
    try {
        // Wipe the existing products out so we don't create duplicates if you run this twice
        await Product.deleteMany({}); 
        console.log('Old products cleared.');

        // Insert our updated products
        await Product.insertMany(kikoProducts);
        console.log(`Successfully added ${kikoProducts.length} Kiko products to the database!`);

        // Close the connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
}

// Execute the function
seedDatabase();
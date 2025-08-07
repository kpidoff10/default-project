import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USER_ID = 'cme1gah1w0002zkk6axi5igw3';

// Données de test pour générer des sessions variées
const COUNTRIES = ['FR', 'US', 'GB', 'DE', 'ES', 'IT', 'CA', 'AU', 'JP', 'KR', 'CN', 'IN', 'BR', 'MX', 'AR', 'RU', 'TR', 'SA', 'AE', 'SG'];
const DEVICE_TYPES = ['desktop', 'tablet', 'mobile'];
const OS_NAMES = ['Windows', 'macOS', 'iOS', 'Android', 'Linux', 'ChromeOS'];

// Générer une date aléatoire dans les 30 derniers jours
function getRandomDate(): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  
  return date;
}

// Générer une session de test
function generateTestSession(index: number) {
  const createdAt = getRandomDate();
  const lastActivity = new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000); // + 0-24h
  
  return {
    sessionToken: `test-session-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: USER_ID,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expire dans 30 jours
    country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
    deviceType: DEVICE_TYPES[Math.floor(Math.random() * DEVICE_TYPES.length)],
    osName: OS_NAMES[Math.floor(Math.random() * OS_NAMES.length)],
    createdAt,
    lastActivity,
  };
}

async function generateTestSessions() {
  try {
    console.log('🚀 Génération de 150 sessions de test...');
    
    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: USER_ID },
    });
    
    if (!user) {
      console.error('❌ Utilisateur non trouvé:', USER_ID);
      return;
    }
    
    console.log('✅ Utilisateur trouvé:', user.email);
    
    // Supprimer les sessions existantes pour cet utilisateur (optionnel)
    const existingSessions = await prisma.session.count({
      where: { userId: USER_ID },
    });
    
    if (existingSessions > 0) {
      console.log(`📊 ${existingSessions} sessions existantes trouvées`);
      const deleteExisting = process.argv.includes('--force');
      
      if (deleteExisting) {
        console.log('🗑️ Suppression des sessions existantes...');
        await prisma.session.deleteMany({
          where: { userId: USER_ID },
        });
      } else {
        console.log('⚠️ Utilisez --force pour supprimer les sessions existantes');
        return;
      }
    }
    
    // Générer 150 sessions
    const sessions = Array.from({ length: 150 }, (_, index) => 
      generateTestSession(index + 1)
    );
    
    console.log('📝 Insertion des sessions...');
    
    // Insérer par lots de 10 pour de meilleures performances
    const batchSize = 10;
    for (let i = 0; i < sessions.length; i += batchSize) {
      const batch = sessions.slice(i, i + batchSize);
      await prisma.session.createMany({
        data: batch,
      });
      console.log(`✅ Lot ${Math.floor(i / batchSize) + 1}/${Math.ceil(sessions.length / batchSize)} inséré`);
    }
    
    // Vérifier le résultat
    const totalSessions = await prisma.session.count({
      where: { userId: USER_ID },
    });
    
    console.log('🎉 Génération terminée !');
    console.log(`📊 Total des sessions pour l'utilisateur: ${totalSessions}`);
    
    // Statistiques
    const stats = await prisma.session.groupBy({
      by: ['country', 'deviceType', 'osName'],
      where: { userId: USER_ID },
      _count: true,
    });
    
    console.log('\n📈 Statistiques:');
    console.log('Pays:', stats.filter(s => s.country).map(s => `${s.country}: ${s._count}`));
    console.log('Appareils:', stats.filter(s => s.deviceType).map(s => `${s.deviceType}: ${s._count}`));
    console.log('OS:', stats.filter(s => s.osName).map(s => `${s.osName}: ${s._count}`));
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
generateTestSessions();

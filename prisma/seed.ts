import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = ['IT и разработка', 'Путешествия', 'Повседневное общение', 'Бизнес'];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const itCat = await prisma.category.findUniqueOrThrow({ where: { name: 'IT и разработка' } });
  const travelCat = await prisma.category.findUniqueOrThrow({ where: { name: 'Путешествия' } });
  const dailyCat = await prisma.category.findUniqueOrThrow({ where: { name: 'Повседневное общение' } });
  const bizCat = await prisma.category.findUniqueOrThrow({ where: { name: 'Бизнес' } });

  await prisma.word.deleteMany();

  await prisma.word.createMany({
    data: [
      { term: 'Deploy', transcription: '[dɪˈplɔɪ]', translation: 'Развёртывать (приложение)', example: 'We will deploy the update tonight.', status: 'LEARNED', categoryId: itCat.id },
      { term: 'Repository', transcription: '[rɪˈpɒzɪtəri]', translation: 'Хранилище кода', example: 'Push your commits to the develop branch.', status: 'LEARNED', categoryId: itCat.id },
      { term: 'Middleware', transcription: '[ˈmɪdlweə]', translation: 'Промежуточное ПО', example: 'Middleware protects private routes.', status: 'LEARNING', categoryId: itCat.id },
      { term: 'Query', transcription: '[ˈkwɪəri]', translation: 'Запрос к базе данных', example: 'Optimize this SQL query.', status: 'NEW', categoryId: itCat.id },
      { term: 'Itinerary', transcription: '[aɪˈtɪnərəri]', translation: 'Маршрут путешествия', example: 'Check the flight itinerary.', status: 'LEARNING', categoryId: travelCat.id },
      { term: 'Departure', transcription: '[dɪˈpɑːtʃə]', translation: 'Отправление, вылет', example: 'Departure time is 10:30 AM.', status: 'LEARNED', categoryId: travelCat.id },
      { term: 'Accommodation', transcription: '[əˌkɒməˈdeɪʃn]', translation: 'Жильё, размещение', example: 'We booked accommodation near the center.', status: 'NEW', categoryId: travelCat.id },
      { term: 'Reliable', transcription: '[rɪˈlaɪəbl]', translation: 'Надёжный', example: 'She is a very reliable friend.', status: 'LEARNED', categoryId: dailyCat.id },
      { term: 'Postpone', transcription: '[pəˈspəʊn]', translation: 'Откладывать, переносить', example: 'Let us postpone the meeting until Monday.', status: 'LEARNING', categoryId: dailyCat.id },
      { term: 'Nevertheless', transcription: '[ˌnevəðəˈles]', translation: 'Тем не менее', example: 'It was raining; nevertheless, we went out.', status: 'NEW', categoryId: dailyCat.id },
      { term: 'Deadline', transcription: '[ˈdedlaɪn]', translation: 'Крайний срок', example: 'We must meet the project deadline.', status: 'LEARNED', categoryId: bizCat.id },
      { term: 'Negotiate', transcription: '[nɪˈɡəʊʃieɪt]', translation: 'Вести переговоры', example: 'They plan to negotiate new terms.', status: 'NEW', categoryId: bizCat.id },
    ],
  });

  console.log('База данных успешно заполнена 12 словами!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

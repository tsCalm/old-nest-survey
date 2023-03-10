import { DataSource } from 'typeorm';
import { join } from 'path';
import entities from '../config-module/typeorm.config';
import { SeedSurvey } from './survey';
import { SeedQuestion } from './question';
import { SeedOption } from './option';

const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities,
});

const getConnection = async () => {
  return await datasource.initialize();
};

export const createDummyData = async () => {
  const connection = await getConnection();
  const surveyList = await SeedSurvey(connection);
  for (let survey of surveyList) {
    const questions = await SeedQuestion(connection, survey.id);
    for (let question of questions) {
      await SeedOption(connection, question);
    }
  }
};

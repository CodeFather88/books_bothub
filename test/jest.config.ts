import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	moduleNameMapper: {
		'^@prisma/(.*)$': '<rootDir>/src/prisma/$1',
		// Добавьте другие алиасы, если необходимо
	},
};

export default config;

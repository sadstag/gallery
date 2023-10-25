import process from "node:process";

export type BuildConfiguration = {
  apiKey: string;
};

export const readBuildConfiguration = async (): Promise<BuildConfiguration> => {
  const file = Bun.file("config.json", {});

  try {
    const config = await file.json();
    return config;
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
};

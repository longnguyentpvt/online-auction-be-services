import { CronJob } from "cron";

import { config } from "db";

import { releaseEndBid } from "services";

const oneMinuteProcesses: (() => Promise<void>)[] = [];

const main = (): void => {
  config();

  oneMinuteProcesses.push(releaseEndBid);

  const oneMinuteCronJob = new CronJob("0 * * * * *", () => {
    console.log("oneMinuteCronJob called");
    for (const task of oneMinuteProcesses) {
      task();
    }
  });

  oneMinuteCronJob.start();
};

main();

import { CreateSpecificationFromStandardJobsSubscriptionDto } from './create-specifications-from-standard-jobs.dto';
import { CreateSpecificationFromStandardJobsSubscription } from './create-specifications-from-standard-jobs.subscription';

export const createSpecificationFromStandardJobs = async (
    payload: CreateSpecificationFromStandardJobsSubscriptionDto,
) => {
    await new CreateSpecificationFromStandardJobsSubscription().MainHandlerAsync(payload);
};

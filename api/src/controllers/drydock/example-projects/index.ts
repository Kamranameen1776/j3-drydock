import { createExampleProjectsAction } from './createExampleProjectsAction';
import { getExampleProjectsAction } from './getExampleProjectsAction';

exports.post = getExampleProjectsAction;
exports.put = createExampleProjectsAction;

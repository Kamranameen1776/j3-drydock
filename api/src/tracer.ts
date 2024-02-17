require('dotenv').config();
import * as os from 'os';

import { tracer, TracerOptions } from 'dd-trace';

const traceOptions: TracerOptions = {
  env: process.env.DD_ENV || os.hostname(),
  sampleRate: +(process.env.DD_TRACE_SAMPLE_RATE || 1),
  profiling: Boolean(process.env.DD_PROFILING_ENABLED || true),
  logInjection: Boolean(process.env.DD_PROFILING_ENABLED || true),
  appsec: Boolean(process.env.DD_APPSEC_ENABLED || true),
  experimental: { iast: Boolean(process.env.DD_IAST_ENABLED || true) }
};
tracer.init(traceOptions); // initialized in a different file to avoid hoisting.
export default tracer;

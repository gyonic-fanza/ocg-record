// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_round_thena.sql';
import m0001 from './0001_salty_hardball.sql';
import m0002 from './0002_oval_darkhawk.sql';
import m0003 from './0003_serious_cyclops.sql';
import m0004 from './0004_remarkable_golden_guardian.sql';
import m0005 from './0005_lush_loki.sql';
import m0006 from './0006_cynical_owl.sql';
import m0007 from './0007_black_bushwacker.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005,
m0006,
m0007
    }
  }
  
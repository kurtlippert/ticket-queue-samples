import * as express from 'express';
import * as https from 'https';
import * as fs from 'fs';
import * as helmet from 'helmet';

import * as mysql from 'mysql';

const options = {
  key: fs.readFileSync(process.env.SSL_PRIVATE_KEY || '', 'utf8'),
  cert: fs.readFileSync(process.env.SSL_CERT || '', 'utf8'),
};

const app = express();

// https://github.com/helmetjs/helmet#how-it-works
app.use(helmet());

// so our server trusts our app
app.use((_: express.Request, res: express.Response, next) => {
  res.setHeader('Access-Control-Allow-Origin', [
    `${process.env.ACCESS_ORIGIN || 'https://localhost:4321'}`,
  ]);
  res.setHeader('Access-Control-Allow-Headers', [
    'Authorization',
    'X-Requested-With',
  ]);
  next();
});

app.get('/tickets', (req, res) => {

  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_INSTANCE,
    multipleStatements: true,
  });

  connection.connect();

  const getTicketStatusQuery = `
  	SELECT
  	  HD_TICKET.ID AS "Id",
  		HD_TICKET.TITLE AS "Title",
  		HD_STATUS.NAME AS "Status",
    		CONCAT(
      		IF(
        		TIME_TO_SEC(NOW()) >= TIME_TO_SEC(HD_TICKET.TIME_OPENED),
          	TO_DAYS(NOW()) - TO_DAYS(HD_TICKET.TIME_OPENED),
          	TO_DAYS(NOW()) - TO_DAYS(HD_TICKET.TIME_OPENED) - 1), 'd ',
          	DATE_FORMAT(ADDTIME('2000-01-01 00:00:00',
          	SEC_TO_TIME(TIME_TO_SEC(NOW()) - TIME_TO_SEC(HD_TICKET.TIME_OPENED))),
              '%kh %im')) AS "Time_Open",
      HD_CATEGORY.NAME AS "Category",
      IFNULL(USER.FULL_NAME,' Unassigned') AS "Assigned_To",
      USER.EMAIL AS "Submitter",
      HD_TICKET.CC_LIST AS "CC_List"
    FROM HD_TICKET
    LEFT JOIN HD_CATEGORY ON HD_CATEGORY_ID = HD_CATEGORY.ID
    LEFT JOIN HD_STATUS ON HD_STATUS_ID = HD_STATUS.ID
    LEFT JOIN USER ON HD_TICKET.SUBMITTER_ID = USER.ID
    INNER JOIN (
      SELECT HD_TICKET.ID FROM HD_TICKET
      INNER JOIN HD_STATUS ON HD_STATUS.ID = HD_TICKET.HD_STATUS_ID
      WHERE HD_TICKET.TITLE LIKE ? ${req.query.statusFilter && '\n      AND HD_STATUS.NAME = ?'}
      ORDER BY HD_TICKET.TIME_OPENED DESC
      LIMIT ${req.query.limit || 10}
      OFFSET ${(req.query.page || 1) * (req.query.limit || 10) - (req.query.limit || 10)}
    ) AS PAGED_TICKETS ON HD_TICKET.ID = PAGED_TICKETS.ID
  `;

  const getTicketCount = `
    SELECT COUNT(HD_TICKET.ID) FROM HD_TICKET
    INNER JOIN HD_STATUS ON HD_STATUS_ID = HD_STATUS.ID
    WHERE HD_TICKET.TITLE LIKE ? ${req.query.statusFilter && '\n    AND HD_STATUS.NAME = ?'}
  `;

  const getStatuses = `
    SELECT DISTINCT HD_STATUS.NAME FROM HD_STATUS
    INNER JOIN HD_TICKET ON HD_TICKET.HD_STATUS_ID = HD_STATUS.ID
  `;

  const titleFilter =
    req.query.titleFilter
      ? `%${req.query.titleFilter}%`
      : '%%';

  const statusFilter = req.query.statusFilter;

  if (req.query.getPageCount !== undefined) {
    connection.query(
      `${getTicketCount};${getTicketStatusQuery};${getStatuses}`,
      [titleFilter, statusFilter, titleFilter, statusFilter].filter(f => f),
      (err, rows) => {
        if (err) { res.send(err); return; }
        res.send({
          statuses: rows[2].map((statusObj: any) => statusObj['NAME']),
          tickets: rows[1],
          pageCount: Math.ceil((rows[0][0]['COUNT(HD_TICKET.ID)']) / (req.query.limit || 20)),
        });
      });
  } else {
    connection.query(
      getTicketStatusQuery,
      [titleFilter, statusFilter],
      (err, rows) => {
        if (err) { res.send(err); return; }
        res.send({ tickets: rows });
      });
  }

  connection.end();
});

// tslint:disable-next-line:no-console
https.createServer(options, app).listen(8080, () => console.log('listening on port 8080!'));

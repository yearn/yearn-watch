import	{NextApiRequest, NextApiResponse}	from	'next';
import	{createHmac}						from	'crypto';

/* 🔵 - Yearn Finance ******************************************************
** This is not used yet. The goal of this webhook file is to be able to
** trigger page revalidation when a static data is updated, just like the
** Yearn Meta stuffs.
**************************************************************************/
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse> {
	if (!req?.body)
		return res.status(400).end();

	const	isMain = req.body?.ref === 'refs/heads/main' || req.body?.ref === 'refs/heads/master';
	const	signature = `sha1=${createHmac('sha1', process.env.GITHUB_WEBHOOK_SECRET as string).update(JSON.stringify(req.body)).digest('hex')}`;
	const	isAllowed = req.headers['x-hub-signature'] === signature;
	if (isMain && isAllowed) {
		console.log('YES!');
		return res.status(200).end();
	} else {
		console.log('NO!');
		return res.status(400).end();
	}
}

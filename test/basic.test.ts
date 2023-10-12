import { assert } from 'chai';
import { contentEngine } from "content-engine";

const engine = contentEngine({
	engineConfig: {
		plugins: [
			{
				// the connector must be built before running tests.
				resolve: require.resolve("../.ntli/connector/package.json"),
				options: {
					guid: "2b17d772-d",
					fetchAPIKey: "defaultlive.ea30c52c8d2af8989ed15578997fac51b7ede4eb4f1878ab6c76867e945541d7",
					previewAPIKey: "defaultpreview.ab58cfd7fc5acbc7af2b3277feee018c5501275b2f6e48120e7c6ec3690dc76c",
					locales: "en-us",
					sitemaps: "website"
				},
			},
		],
	},
});


describe("connector tests", () => {

	after(async () => {
		await engine.stop();
	});

	it("Fetches data from the example connector", async function () {
		this.timeout(0)

		const syncState = await engine.sync({
			clearCache: false,
			buildSchema: true
		});


		assert.isUndefined(syncState.exitCode, "The sync should not have exited with an error");
		assert.isAtLeast((await engine.test.getNodes()).length, 1, "There should be at least one node in the graph");

		assert.isAtLeast((await engine.test.getNodesByType("AgilityPost")).length, 1, "There should be at least one AgilityPost in the graph")

		const { data, errors } = await engine.test.query(
      /* GraphQL */ `
        query {
          allAgilityPost {
            nodes {
              id
              title
            }
          }
        }
      `,
			{}
		);

		assert.isUndefined(errors, "There should be no errors in the query");

		//@ts-ignore
		assert.isAtLeast(data.allAgilityPost.nodes.length, 1, "There should be at least one AgilityPost in the graph")

		//@ts-ignore
		for (const post of data.allAgilityPost.nodes) {
			assert.isNotEmpty(post.title, "The post should have a title")
		}
	});
});







describe('Array', function () {
	describe('#indexOf()', function () {
		it('should return -1 when the value is not present', function () {
			assert.equal([1, 2, 3].indexOf(4), -1);
		});
	});
});
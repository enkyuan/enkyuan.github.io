const Projects = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-8">what i'm working on</h1>
      <div className="grid gap-8">
        <div className="border-2 border-gray-100 rounded-sm p-4">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-semibold mb-2">rofl</h2>
            <a
              href="https://github.com/enkyuan/rofl"
              className="text-blue-500 hover:underline"
            >
              repo
            </a>
          </div>
          <p className="text-md text-gray-700 mb-4">
            real-time liquidity optimization engine
          </p>
          <ul className="text-sm space-y-4 ml-6 text-gray-700">
            <li>
              - aggregates market data from coinbase, kraken, and other major
              crypto exchanges to identify optimal positions
            </li>
            <li>
              - polling with data from bitfinex and okx to identify recent bids
              and approximate asks
            </li>
            <li>
              - queueing system to manage orders and execute trades based on
              consensus algorithm
            </li>
            <li>- wallet integrations for access to funds and transactions</li>
          </ul>
          <p className="text-sm text-gray-700 mt-4">
            more updates coming soon™
          </p>
        </div>

        <div className="border-2 border-gray-100 rounded-sm p-4">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-semibold mb-2">postmark</h2>
            <a href="#" className="text-blue-500 hover:underline">
              repo
            </a>
          </div>
          <p className="text-md text-gray-700 mb-4">
            indexing platform for books, articles, and written content
          </p>
          <ul className="text-sm space-y-4 ml-6 text-gray-700">
            <li>
              - tri-agent system to predict the best responses to the most
              likely replies and evaluate conversation in the context of a goal
            </li>
            <li>
              - parallel processing enables the simulation hundreds of
              conversations through 6 layers of conversation depth using Llama
              3.3 70B, in ~10 seconds
            </li>
            <li>
              - monte carlo simulation uses probability-weighted simulations to
              optimize responses
            </li>
            <li>
              - imessage integration in a live chat editor, showing branching
              conversation trees with analysis in real-time
            </li>
          </ul>
          <p className="text-sm text-gray-700 mt-4">
            more updates coming soon™
          </p>
        </div>

        <div className="border-2 border-gray-100 rounded-sm p-4">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-semibold mb-2">c4</h2>
            <a href="#" className="text-blue-500 hover:underline">
              repo
            </a>
          </div>
          <p className="text-md text-gray-700 mb-4">
            bootstrapped compiler for C
          </p>
          <ul className="text-sm space-y-4 ml-6 text-gray-700">
            <li>
              - tri-agent system to predict the best responses to the most
              likely replies and evaluate conversation in the context of a goal
            </li>
            <li>
              - parallel processing enables the simulation hundreds of
              conversations through 6 layers of conversation depth using Llama
              3.3 70B, in ~10 seconds
            </li>
            <li>
              - monte carlo simulation uses probability-weighted simulations to
              optimize responses
            </li>
            <li>
              - imessage integration in a live chat editor, showing branching
              conversation trees with analysis in real-time
            </li>
          </ul>
          <p className="text-sm text-gray-700 mt-4">
            more updates coming soon™
          </p>
        </div>

        {/*  Add other projects here in the same format */}
        {/* <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Project Title</h2>
           <p>...</p>
        </div> */}
      </div>
    </div>
  );
};

export default Projects;

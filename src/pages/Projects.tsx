const Projects = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-8">what i'm working on</h1>
      <div className="grid gap-8">
        <div className="border-2 border-gray-100 rounded-sm p-4">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-semibold mb-2">
              <a
                href="https://github.com/enkyuan/rofl"
                className="underline underline-offset-4"
              >
                rofl
              </a>
            </h2>
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
            <h2 className="text-xl font-semibold mb-2">
              <a
                href="https://github.com/enkyuan/c4"
                className="underline underline-offset-4"
              >
                c4
              </a>
            </h2>
          </div>
          <p className="text-md text-gray-700 mb-4">
            bootstrapped compiler for C
          </p>
          <ul className="text-sm space-y-4 ml-6 text-gray-700">
            <li>
              - implements a recursive descent parser with precedence climbing for
              efficient expression parsing and abstract syntax tree generation
            </li>
            <li>
              - features robust error handling and recovery mechanisms for improved
              developer experience during compilation
            </li>
            <li>
              - performs semantic analysis and type checking with support for C11
              standard features and common extensions
            </li>
            <li>
              - generates optimized x86_64 assembly output with basic block
              analysis and register allocation
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

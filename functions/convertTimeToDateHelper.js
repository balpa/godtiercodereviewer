const recast = require('recast');
const { namedTypes: n, builders: b } = recast.types;

const TIME_CONSTANTS = [
    { value: 86400000, name: 'ONE_DAY_AS_MILLISECONDS', priority: 5 },
    { value: 3600000, name: 'ONE_HOUR_AS_MILLISECONDS', priority: 2 },
    { value: 1800000, name: 'THIRTY_MINUTES_AS_MILLISECONDS', priority: 3 },
    { value: 60000, name: 'ONE_MINUTE_AS_MILLISECONDS', priority: 4 },
    { value: 1000, name: 'ONE_SECOND_AS_MILLISECOND', priority: 1 },
    { value: 86400, name: 'ONE_DAY_AS_SECONDS', priority: 6 },
    { value: 3600, name: 'ONE_HOUR_AS_SECONDS', priority: 7 },
    { value: 1800, name: 'THIRTY_MINUTES_AS_SECONDS', priority: 8 },
    { value: 60, name: 'ONE_MINUTE_AS_SECONDS', priority: 9 },
    { value: 604800, name: 'ONE_WEEK_AS_SECONDS', priority: 10 }
];

function findBestMatch(milliseconds) {
    const sorted = [...TIME_CONSTANTS].sort((a, b) => a.priority - b.priority);
    
    for (const constant of sorted) {
        if (milliseconds === constant.value) {
            return { constant: constant.name, multiplier: 1 };
        }

        const multiplier = milliseconds / constant.value;
        if (Number.isFinite(multiplier) && multiplier > 0) {
            return { constant: constant.name, multiplier };
        }
    }
    
    return null;
}

function convertTimeToDateHelper(ast) {
    recast.visit(ast, {
        visitCallExpression(path) {
            const { callee, arguments: args } = path.node;

            const isSetTimeout =
                n.Identifier.check(callee) && callee.name === 'setTimeout';

            if (isSetTimeout && args.length >= 2) {
                const timeArg = args[1];

                if (n.Literal.check(timeArg) && typeof timeArg.value === 'number') {
                    const match = findBestMatch(timeArg.value);

                    if (match) {
                        const dateHelperAccess = b.memberExpression(
                            b.memberExpression(
                                b.identifier('Insider'),
                                b.identifier('dateHelper')
                            ),
                            b.identifier(match.constant)
                        );

                        if (match.multiplier === 1) {
                            args[1] = dateHelperAccess;
                        } else {
                            args[1] = b.binaryExpression(
                                '*',
                                b.literal(match.multiplier),
                                dateHelperAccess
                            );
                        }
                    }
                }
            }

            this.traverse(path);
        }
    });
}

module.exports = { convertTimeToDateHelper };

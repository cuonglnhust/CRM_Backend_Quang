export function Response(handel) {
    return async (req, res, next) => {
        try {
            let data = await handel(req, res, next);
            return res.send({
                signal: 1,
                message: 'SUCCESS',
                code: 200,
                data: data
            });
        } catch (err) {
            let message = err.message
            return res.send({
                signal: 0,
                code: 400,
                message
            });
        }
    };
}
export function calculateTotalReviews({five_star, four_star, three_star, two_star, one_star}) {
    const five_st = parseFloat(five_star) || 0;
    const four_st = parseFloat(four_star) || 0;
    const three_st = parseFloat(three_star) || 0;
    const two_st = parseFloat(two_star) || 0;
    const one_st = parseFloat(one_star) || 0;
    return five_st + four_st + three_st + two_st + one_st;
};

export function calculateAverageRating({five_star, four_star, three_star, two_star, one_star}) {
    const five_st = parseFloat(five_star) || 0;
    const four_st = parseFloat(four_star) || 0;
    const three_st = parseFloat(three_star) || 0;
    const two_st = parseFloat(two_star) || 0;
    const one_st = parseFloat(one_star) || 0;
    return (
        (
            5 * five_st + 4 * four_st + 3 * three_st + 2 * two_st + one_st
        ) / (
            (five_st + four_st + three_st + two_st + one_st) || 1
        )
    );
};
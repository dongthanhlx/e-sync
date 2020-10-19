export function produceHeaderClassName(base_sort_attribute, current_sort_attribute, ascending) {
    return base_sort_attribute
        ? base_sort_attribute === current_sort_attribute
            ? ascending
                ? 'sel-table-sort-column ascending'
                : 'sel-table-sort-column descending'
            : 'sel-table-sort-column'
        : ''
}

export function produceNewSortState(new_sort_attribute, {sort_attribute, ascending}) {
    if (new_sort_attribute === sort_attribute) {
        return {sort_attribute, ascending: !ascending};
    } else {
        return {sort_attribute: new_sort_attribute, ascending: true};
    }
}
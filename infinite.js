'use strict';
module.exports = {
    fromArray: function(array) {
        if (array.length == 0) {
            return {
                head: null,
                tail: null
            }
        }

        if (array.length == 1) {
            return {
                head: array[0],
                tail: () => null                
            }
        }
        const [head, ...tail] = array
        
        return {
            head: head,
            tail: () => this.fromArray(tail)
        }   
    },

    append: function (list, x) {
        let tail = list.tail()

        if (tail === null) {
            return {
                head: list.head,
                tail: () => {
                    return {
                        head: x,
                        tail: () => null
                    }
                }
            }
        }
        
        return {
            head: list.head,
            tail: () => this.append(tail, x)
        }
    },

    prepend: function (list, x) {
        return {
            head: x,
            tail: () => list
        }
    },

    cycle: function (list) {
        var cycleHelper = (list, toCycle) => {
            if (list.head === null) {
                return {
                    head: null,
                    tail: null
                }
            }
    
            let tail = list.tail()
    
            if (tail === null) {
                return {
                    head: list.head,
                    tail: () => this.cycle(toCycle)
                }
            }
    
            return {
                head: list.head,
                tail: () => cycleHelper(tail, toCycle)
            }
        }
        
        return cycleHelper(list, list)
    },

    take: function (list, x) {
        var takeHelper = (list, state, x) => {
            if (x <= 0) {
                return state
            }

            if (list === null) {
                 return state
            }

            if (list.head === null) {
                return state
            }

            state.push(list.head) // fix this mutable shit...
            return takeHelper(list.tail(), state, x - 1)
        }

        return takeHelper(list, [], x)
    },

    drop: function (list, x) {
        if (x <= 0 || list === null || list.head === null) {
            return list
        }

        return this.drop(list.tail(), x - 1)
    },

    clone: function (list) {
        return {
            head: list.head,
            tail: () => list.tail()
        }
    },

    head: function (list) {
        return list.head
    },

    last: function (list) {
        if (list.head === null) {
            return null
        }

        let tail = list.tail()
        
        if (tail === null) {
            return list.head
        }

        return this.last(list.tail())
    },
    /**
     * Possible infinite sequence, which starts with the initial element and computes the next integer using the function. 
     * The list will be finite if the function ever returns null given the element
     */
    sequence: function (el, computeNext) {
        if (el === null) {
            return null
        }

        return {
            head: el,
            tail: () => this.sequence(computeNext(el), computeNext)
        }
    },

    range: function (begin, endInc) {
        return this.sequence(begin, (x) => {
            if (x < endInc) {
                return x + 1
            } else {
                return null
            }
        })
    },

    map: function (list, f) {
        if (list.head === null) {
            return list
        }

        let tail = list.tail()

        if (tail === null) {
            return {
                head: f(list.head),
                tail: () => null
            }
        }

        return {
            head: f(list.head),
            tail: () => this.map(tail, f)
        }
    },

    // concat: function (list1, list2) {
    //     if (list1 === null || list1.head === null) {
    //         return list2
    //     }

    //     let tail = list1.tail()

    //     if (tail === null) {
    //         return {
    //             head: list1.head,
    //             tail: () => tail
    //         }
    //     }

    //     console.log(tail)
    //     return {
    //         head: list1.head,
    //         tail: () => this.concat(tail, list2)
    //     }
    // },

    // flatten: function (listOfLists) {
    //     if (listOfLists === null) { return null }
    //     if (listOfLists.length === 0) { return listOfLists }
    //     if (listOfLists.length === 1) { return listOfLists.head }

    //     let firstTwo = this.take(listOfLists, 2)

    //     return this.flatten(
    //         this.prepend(
    //             this.drop(listOfLists, 2),
    //             this.concat(
    //                 firstTwo[0], 
    //                 firstTwo[1]
    //             )
    //         )
    //     )
    // },

    isEmpty: function (list) {
        return list.head === null
    },

    empty: {
        head: null,
        tail: () => null
    },

    pure: (x) => fromArray([x])
}       
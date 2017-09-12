"""
Edge cases to still worry about / needs to be addressed (maybe not in this file or in python but somewhere):

- if a player submits a bid twice for a player with a different value we need to only accept the most recent one
- if two teams tie for a player, we could give to to the lower ranked team, or we could do it by whoever submitted their
bid first. Either works.
- ...Probably some more that I haven't thought of yet.

"""

# a dictionary keeping track of team's points
# [normalPoints, call up points (in 100's i.e. 3 means 300 WP)
teamPoints = {"21 Juke Street": [0, 0], \
              "877-CAPSNOW": [0, 0], \
              "Army of Re": [0, 0], \
              "Attack the Block": [0, 0], \
              "Bad News Balls": [0, 0], \
              "Ball Fondlers": [0, 0], \
              "Ball or Nothing": [0, 0], \
              "Balladega Nights": [0, 0], \
              "Block-A-Doodle-Doo": [0, 0], \
              "Blockwork Orange": [0, 0], \
              "Cap'n Crunch": [0, 0], \
              "Circular Logic": [0, 0], \
              "Coup d'Ecap": [0, 0], \
              "House of Caps": [0, 0], \
              "Insane Cap Posse": [0, 0], \
              "Jukes and Cats": [0, 0], \
              "Mo Money Mo Poplems": [0, 0], \
              "Pequenos Pandas": [0, 0], \
              "Soviet Ballers": [0, 0], \
              "The Capaliers": [0, 0], \
              "The Empire Snipes Back": [0, 0], \
              "The Tagalongs": [0, 0], \
              "Warden and the Inmates": [0, 0], \
              "Whitecaps": [0, 0]}


# the number of WP a team has to spend
def getPoints(teamName):
    return teamPoints[teamName][0] + teamPoints[teamName][1] * 100


# give teams more WP
def addPoints(teamName, amount):
    teamPoints[teamName][0] += amount[0]
    teamPoints[teamName][1] += amount[1]


# subtract points from teams
def subtractPoints(teamName, amount):
    teamPoints[teamName][0] -= amount[0]
    teamPoints[teamName][1] -= amount[1]


# takes a list of bids and fixes any illegal bids
def fixBids(smallBidList):  # small bid list is a list of tuples (teamName, player name, bid amount)
    # for every bid in the list, check to see if the bid is negative, too high, or not possible with their combination
    # of normal WP and call up WP
    for bid in smallBidList:
        normalAmount = teamPoints[teamName][0]
        bidAmount = bid[2]
        teamName = bid[0]
        # amount of points a team can spend max
        onHand = getPoints(teamName)

        # WP can't be negative
        if bidAmount < 0:
            bidAmount = 0
        # can't spend more WP than you have
        elif bidAmount > onHand:
            bidAmount = onHand
        # has to be possible with their combination of normal and call up WP
        elif bidAmount % 100 > normalAmount:
            bidAmount = bidAmount - (bidAmount % 100) + normalAmount


# creates a dictionary with every player name in it
def createBidDictionary(rawBids):  # Assume rawBids is a list of arrays {[team name, player name, bidAmount]}
    # initialize bid dict as an empty dictionary
    bidDict = dict()

    # for every bid, check to see if the player being bid on is in the dictionary
    # if not, add them and set the value to an empty field (won't be accessed)
    for bid in rawBids:
        if bid[1] not in bidDict:
            bidDict[bid[1]] = ""

    # return the empty bidDict
    return bidDict


# process the raw bids
def processBids(rawBids): # Assume rawBids is a list of arrays{[team name, player name, bidAmount]}
    # first make sure all bids are legal
    fixBids(rawBids)
    # sort all the bids in descending order by bid amount
    rawBids = sorted(rawBids, key = lambda x: x[2], reverse = True)
    # create a dictionary of all the players being bid on
    bidDict = createBidDictionary(rawBids)
    # create an empty dictionary which will be used to store the bids that win
    successfulBids = dict()
    # while the dictionary of player names isn't empty
    while(bool(bidDict)):
        # put the first item in raw bids in the winning bids
        # since rawBids is sorted the first item will always be a winning bid
        successfulBids[rawBids[0][1]] = (rawBids[0][0], rawBids[0][2])
        # create a variable to store the name of the player who was won
        pName = successfulBids[rawBids[0][1]]
        # delete the player from list of player names since he's been processed
        del bidDict[rawBids[0][1]]
        # delete all other bids for the player since they've already been won
        rawBids[:] = [k for k in rawBids if not k[1] == pName]
        # fix bids again since WP's of teams have now changed
        fixBids(rawBids)
        # sort the bids again (not really necessary but just to be safe)
        rawBids = sorted(rawBids, key = lambda x: x[2], reverse = True)
    # return the list of bid winners in the format (playerName: (team name, bid amount))
    return successfulBids


# process the successful bids
def processSuccessfulBids(successfulBids):
    # for every winning bid
    for bid in successfulBids:
        # create variables for team name, normal amount, and hundred amount
        # initialize hundred amount to 0 and normal amount to the total bid amount
        teamName = bid[0]
        normalAmount = bid[1]
        hundredAmount = 0

        # if the normal amount is 100 or more, and the team has hundreds they can use
        if normalAmount >= 100 and teamPoints[teamName][1] > 0:
            # set a variable count to the number of 100s they have
            count = teamPoints[teamName][1]
            # while the team still has hundreds and the normal amount is over 100
            while count > 0 and normalAmount > 100:
                # increase the hundreds used by 1
                hundredAmount += 1
                # decrease the normal amount to account for this
                normalAmount -= 100
                # reduce the count by 1, making sure that they don't use more hundreds than they have
                count -= 1

        # subtract the final tally of normal points and hundreds points from the team's total
        subtractPoints(teamName, (normalAmount, hundredAmount))

# takes in raw bids and does all function in one main one
def findSuccessfulBids(rawBids):
    # find successful bids
    successfulBids = processBids(rawBids)
    # process the winning bids
    processSuccessfulBids(successfulBids)
    # return the successful bids
    return successfulBids


def main():
    pass


if __name__ == '__main__':
    main()
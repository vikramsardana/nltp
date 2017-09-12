#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      Vikram
#
# Created:     23/05/2016
# Copyright:   (c) Vikram 2016
# Licence:     <your licence>
#-------------------------------------------------------------------------------
import operator
#from sets import Set

first = ["Constriction", "EMERALD", "Constriction", "Boombox", "Constriction", "Star", "Market", "Smirk", "Birch", "IRON", "Birch", "Transilio", "EMERALD", "IRON", "GamePad", "Wormy", "Star", "Pilot", "Transilio", "Velocity", "Thinking With Portals"]

second = ["Pilot", "Pilot", "IRON", "Bombing Run", "Star", "Constriction", "IRON", "GeoKoala", "Hotspot", "Pilot", "Pilot", "Velocity", "Transilio", "Smirk", "Constriction", "EMERALD", "Monarch", "Transilio", "Pilot", "Boombox", "Wormy"]

third = ["Scorpio", "Transilio", "Pilot", "Danger Zone 3", "Velocity", "Wormy", "Wormy", "Velocity", "Pilot", "Scorpio", "Smirk", "Wormy", "Pilot", "Transilio", "IRON", "IRON", "Transilio", "Smirk", "Constriction", "Scorpio", "Velocity"]

fourth = ["Transilio", "SuperDuperStamp", "Lights", "Star", "IRON", "Transilio", "Transilio", "Boombox", "Lights", "Velocity", "Transilio", "Constriction", "Wormy", "Boombox", "Pilot", "Smirk", "Grail of Speed", "EMERALD", "GeoKoala", "Pilot", "Constriction"]


fifth = ["Velocity", "Wormy", "Smirk", "GeoKoala", "Monarch", "Smirk", "Constriction", "Thinking With Portals", "Smirk", "Transilio", "Velocity", "Pilot", "Hotspot", "EMERALD", "Transilio", "Velocity", "Pilot", "Wormy", "Birch", "Mode 7", "Transilio"]

sixth = ["EMERALD", "Velocity", "Scorpio", "Velocity", "Pilot", "Boombox", "Pilot", "Pilot", "Transilio", "Wormy", "Wormy", "IRON", "Scorpio", "Rush", "Wormy", "Pilot", "45", "Constriction", "Scorpio", "IRON", "Boombox"]

seventh = ["Citadel", "Scorpio", "Transilio", "Transilio", "Scorpio", "EMERALD", "Hurricane", "IRON", "Scorpio", "Market", "Star", "Renegade", "Jagged", "Monarch", "Smirk", "Rush", "Hurricane", "IRON", "Market", "Transilio", "Pilot"]

eighth = ["Monarch", "Constriction", "Wormy", "IRON", "Transilio", "GeoKoala", "Monarch", "SuperDuperStamp", "EMERALD", "Boombox", "Danger Zone 3", "Rush", "IRON", "Scorpio", "Scorpio", "Constriction", "Wormy", "Velocity", "Jagged", "Constriction", "EMERALD"]

ninth = ["Rush", "Smirk", "EMERALD", "Thinking With Portals", "Wormy", "Market", "Danger Zone 3", "Transilio", "Hornswoggle", "Birch", "IRON", "Draft", "SuperDuperStamp", "Constriction", "EMERALD", "Boombox", "IRON", "Rush", "Rush", "Hexane", "GeoKoala"]

tenth = ["Smirk", "Monarch", "Monarch", "The Holy See", "Danger Zone 3", "Birch", "Star", "CFB", "DZ4", "Blast Off", "Boombox", "Lights", "Lights", "Hotspot", "Birch", "Monarch", "Velocity", "Scorpio", "Star", "Monarch", "Smirk"]

eleventh = ["Wormy", "Rush", "Thinking With Portals", "Smirk", "Flame",  "Jagged", "Danger Zone 3", "Danger Zone 3", "Star", "Frontdoor", "Boombox", "Danger Zone 3", "CFB", "45", "CFB", "Bombing Run", "Monarch", "Ultradrive", "Star", "IRON"]

twelfth = ["Frontdoor", "DZ4", "Danger Zone 3", "Wormy", "Hornswoggle", "Ultradrive", "Constriction", "Draft", "EMERALD", "Lights", "Scorpio", "Smirk", "Hurricane", "Hotspot", "GeoKoala", "Gamepad", "Lights", "Smirk", "Wormy", "Dealer"]


def buildMapSet():
	maps = set(first)
	maps = maps.union(set(second))
	maps = maps.union(set(third))
	maps = maps.union(set(fourth))
	maps = maps.union(set(fifth))
	maps = maps.union(set(sixth))
	maps = maps.union(set(seventh))
	maps = maps.union(set(eighth))
	maps = maps.union(set(ninth))
	maps = maps.union(set(tenth))
	maps = maps.union(set(eleventh))
	maps = maps.union(set(twelfth))
	return maps

def buildMapDict(setOfMaps):
	mapDict = dict()
	for elt in setOfMaps:
		mapDict[elt] = 0
	return mapDict


def processPicks(mapDict):
	for x in first:
#		mapDict[x] += 12
		mapDict[x] += 1
	for x in second:
#		mapDict[x] += 11
		mapDict[x] += 1
	for x in third:
#		mapDict[x] += 10
		mapDict[x] += 1
	for x in fourth:
#		mapDict[x] += 9
		mapDict[x] += 1
	for x in fifth:
#		mapDict[x] += 8
		mapDict[x] += 1
	for x in sixth:
#		mapDict[x] += 7
		mapDict[x] += 1
	for x in seventh:
#		mapDict[x] += 6
		mapDict[x] += 1
	for x in eighth:
#		mapDict[x] += 5
		mapDict[x] += 1
	for x in ninth:
#		mapDict[x] += 4
		mapDict[x] += 1
	for x in tenth:
#		mapDict[x] += 3
		mapDict[x] += 1
	for x in eleventh:
#		mapDict[x] += 2
		mapDict[x] += 1
	for x in twelfth:
#		mapDict[x] += 1
		mapDict[x] += 1
	return mapDict




def main():
	setOfMaps = buildMapSet()
	mapDict = buildMapDict(setOfMaps)
	mapDict = processPicks(mapDict)
	sorted_maps = sorted(mapDict.items(), key=operator.itemgetter(1), reverse=True)
	print(sorted_maps)

if __name__ == '__main__':
    main()

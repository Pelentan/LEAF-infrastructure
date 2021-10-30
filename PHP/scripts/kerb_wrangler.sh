#!/bin/bash

# This should keep the ticket up todate.  It uses a refresh every 9 1/2 hours.  Then a day short of the final refresh
# it does a full renewal.  Hopefully.  

export cache="/tmp/krb5cc_`id -u`"

init_kerberos () {
    krb_login=$(echo ${KRB_USER} | tr [A-Z] [a-z])@$(echo ${KRB_DOMAIN} | tr [a-z] [A-Z])
    echo ${KRB_PASSWORD} | kinit ${krb_login}
    renew_until=$(klist | grep "renew until" | sed 's/renew until //')
    let runix=$(date -d "$renew_until" +%s)-86400
}

renew_kerberos () {
    current_expire=$(klist | grep "krbtgt/VHA.MED.VA.GOV@VHA.MED.VA.GOV")
    kinit -R -c $cache 
    new_expire=$(klist | grep "krbtgt/VHA.MED.VA.GOV@VHA.MED.VA.GOV")
    if [ "$current_expire" = "$new_expire" ]
    then
        echo "***** Failed renew.  Attempting reinit" >> kerb_log.log
        init_kerberos
    else
        echo "Renewed ticket"
    fi
}

set_cache_perms () { 
    # This is so the application that needs to use the link can access the cache file.   
    chown www-data:www-data $cache
    ls -lah $cache
}

# init_kerberos
# set_cache_perms
runix=0
while true; do
    tNow=$(date +%s)
    echo "---------------------------------------------------" >> kerb_log.log
    echo "Checking time stamps:  runix: $runix  now: $tNow" >> kerb_log.log
    date >> kerb_log.log
    if [ $runix -gt $tNow ] 
    then
        echo "Refreshing kerberos ticket" >> kerb_log.log
        renew_kerberos
    else
        echo "Starting or reinitializing kerberos" >> kerb_log.log
        init_kerberos
    fi
    echo "Complete" >> kerb_log.log
    klist >> kerb_log.log
    set_cache_perms
    sleep 9.5h
done




Introduction
============

[Payutc](https://github.com/payutc) est un système de paiement avec porte-monnaie électronique avec une architecture client/serveur basée sur des Web Services. 
Il est utilisé au sein des associations de l'[Université de Technologie de Compiègne](http://www.utc.fr).

Ce dépôt héberge Mozart, le client pour les encaissements via une interface tactile, qui permet également l'impression des tickets.


Contribuer
==========

Le projet est distribué sous licence GPLv3. Nous acceptons les contributions directement sous forme de [pull requests](https://help.github.com/articles/using-pull-requests).

Une mailing-liste regroupant les développeurs est disponible, écrivez à [payutc@assos.utc.fr](mailto:payutc@assos.utc.fr) pour demander à être inscrit (ou pour toute autre demande !).


Installer Mozart
================

Mozart est un client javascript, qui à la particularité de s'auto-enregistrer auprès du serveur.
La configuration est donc très simple, après avoir rendu accessible dans votre navigateur les fichiers, il suffit de copier le fichier /js/config.dist.js en /js/config.js et de remplacer l'url du serveur, par l'url du serveur que vous souhaitez utiliser.

Ensuite lorsque vous accèderez à Mozart pour la première fois, il ira se déclarer auprès du serveur.
Il faut un suite qu'un administrateur ayant les droits suffisants, donne à l'application nouvellement crée le droit "Vente Physique" sur une ou plusieurs fundations.

Ensuite réactualisez la page de mozart, si vous avez bien les droits de vente, ainsi que l'application vous devriez voir la liste des articles s'afficher.


Client JAVA local pour accèder à la badgeuse et à l'imprimante
==============================================================

Pour accéder aux périphériques matériel tel que la badgeuse et l'imprimante, nous avons crée un programme java, qui expose des websockets utilisé par mozart.
A terme, mozart indiquera lui même la procédure à suivre pour installer ce programme s'il n'est pas présent sur la machine ou vous souhaitez utiliser mozart.
Pour l'instant il faut le faire manuellement. Le .jar se trouve ici [jcappuccino.jar](https://github.com/payutc/jcappuccino/blob/master/jcappuccino.jar).

Sur Ubuntu 64bits, il faut entre autre installer et executer les commandes suivantes :

Installer Java 7 depuis oracle (le programme ne tourne pas avec openjdk)
``
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java7-installer
cd /usr/lib/jvm
sudo ln -s java-7-oracle default-java
``

Installation des packages
``
apt-get install libpcsclite1 pcsc-tools libccid pcscd
sudo updatedb
locate libpcsclite  # Pour la commande suivante, parfois libpcsclite.so.1 peut se trouver ailleurs
ln -s /lib/x86_64-linux-gnu/libpcsclite.so.1 /usr/local/lib/libpcsclite.so
``

Lancement du programme
``
java -Dsun.security.smartcardio.library=/usr/local/lib/libpcsclite.so -jar jcappuccino.jar
``




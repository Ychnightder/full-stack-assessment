from django.contrib.gis.db import models



class Bridge(models.Model):
    """
    Représentation d'un pont dans la base de données.
    Chaque pont possède un identifiant, un nom et une localisation.
    """
      
    bridge_id = models.CharField(
        max_length=10, 
        primary_key=True,
        help_text="Identifiant unique du pont"
    )

    name = models.CharField(
        max_length=100,
        help_text="Nom du pont"
    )
    location = models.GeometryField(
        help_text="Coordonnées géographiques du pont"
    )

    class Meta:
        db_table = "bridges" 

    def __str__(self):
        """Représentation de l'objet."""
        return f"{self.bridge_id} - {self.name}"